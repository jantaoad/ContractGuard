"""
RAG Service - Retrieval-Augmented Generation for Contract Analysis
Orchestrates vector storage, retrieval, and LLM integration for legal document understanding
"""

from typing import Optional
from dataclasses import dataclass
from enum import Enum
import logging

logger = logging.getLogger(__name__)


@dataclass
class RetrievalContext:
    """Context for RAG retrieval operations"""
    query: str
    top_k: int = 5
    threshold: float = 0.7
    filters: Optional[dict] = None


class ClauseCategory(str, Enum):
    """Legal clause categories for classification"""
    LIABILITY = "liability"
    TERMINATION = "termination"
    RENEWAL = "renewal"
    PAYMENT = "payment"
    CONFIDENTIALITY = "confidentiality"
    IP = "intellectual_property"
    WARRANTY = "warranty"
    INDEMNIFICATION = "indemnification"
    COMPLIANCE = "compliance"
    OTHER = "other"


class RAGService:
    """
    Retrieval-Augmented Generation Service
    
    Responsibilities:
    - Chunk documents for vector storage
    - Create embeddings via OpenAI
    - Store/retrieve from Pinecone
    - Orchestrate LLM context retrieval
    - Manage vector metadata
    """

    def __init__(self, pinecone_client=None, llm_service=None, vector_service=None):
        """
        Initialize RAG service with dependencies
        
        Args:
            pinecone_client: Pinecone client instance
            llm_service: LLM service for generating embeddings
            vector_service: Vector database operations service
        """
        self.pinecone = pinecone_client
        self.llm_service = llm_service
        self.vector_service = vector_service
        self.index_name = "contractguard-kb"
        self.chunk_size = 1000
        self.chunk_overlap = 200

    async def chunk_document(self, text: str, metadata: dict) -> list[dict]:
        """
        Chunk contract text for vector storage
        
        Strategy: Semantic chunking with metadata preservation
        - Split by clause boundaries when possible
        - Fixed size fallback (1000 chars with overlap)
        - Preserve page numbers and clause categories
        
        Args:
            text: Contract text
            metadata: Document metadata (contract_id, page_numbers, etc.)
            
        Returns:
            List of chunks with metadata
        """
        chunks = []
        
        # Split by sentences first for semantic chunking
        sentences = self._split_sentences(text)
        
        current_chunk = ""
        chunk_index = 0
        
        for sentence in sentences:
            if len(current_chunk) + len(sentence) < self.chunk_size:
                current_chunk += " " + sentence
            else:
                if current_chunk:
                    chunks.append({
                        "id": f"{metadata.get('contract_id')}_chunk_{chunk_index}",
                        "text": current_chunk.strip(),
                        "metadata": {
                            **metadata,
                            "chunk_index": chunk_index,
                            "chunk_size": len(current_chunk),
                        }
                    })
                    chunk_index += 1
                    # Overlap for context
                    current_chunk = sentence[-min(self.chunk_overlap, len(sentence)):]
                else:
                    current_chunk = sentence
        
        # Final chunk
        if current_chunk:
            chunks.append({
                "id": f"{metadata.get('contract_id')}_chunk_{chunk_index}",
                "text": current_chunk.strip(),
                "metadata": {
                    **metadata,
                    "chunk_index": chunk_index,
                }
            })
        
        logger.info(f"Created {len(chunks)} chunks for contract {metadata.get('contract_id')}")
        return chunks

    async def store_embeddings(self, contract_id: str, chunks: list[dict]) -> list[str]:
        """
        Store chunks as embeddings in Pinecone
        
        Args:
            contract_id: Contract identifier
            chunks: Chunks with text and metadata
            
        Returns:
            List of stored vector IDs
        """
        vector_ids = []
        
        for chunk in chunks:
            try:
                # Generate embedding
                embedding = await self.llm_service.embed_text(chunk["text"])
                
                # Store in Pinecone
                vector_id = await self.vector_service.upsert(
                    vector_id=chunk["id"],
                    values=embedding,
                    metadata=chunk["metadata"]
                )
                vector_ids.append(vector_id)
                
            except Exception as e:
                logger.error(f"Failed to embed chunk {chunk['id']}: {str(e)}")
                raise
        
        logger.info(f"Stored {len(vector_ids)} embeddings for contract {contract_id}")
        return vector_ids

    async def retrieve_context(self, context: RetrievalContext) -> list[dict]:
        """
        Retrieve relevant chunks from Pinecone for a query
        
        RAG Retrieval Strategy:
        1. Embed user query
        2. Search Pinecone with similarity threshold
        3. Re-rank results by relevance
        4. Return top-k with metadata
        
        Args:
            context: Retrieval parameters
            
        Returns:
            List of relevant chunks with scores
        """
        # Embed the query
        query_embedding = await self.llm_service.embed_text(context.query)
        
        # Search Pinecone
        results = await self.vector_service.search(
            vector=query_embedding,
            top_k=context.top_k,
            filters=context.filters,
            threshold=context.threshold
        )
        
        # Format results with metadata
        retrieved = [
            {
                "text": result["metadata"].get("text"),
                "relevance_score": result["score"],
                "metadata": result["metadata"],
                "source_chunk": result["id"]
            }
            for result in results
        ]
        
        logger.debug(f"Retrieved {len(retrieved)} relevant chunks for query: {context.query[:50]}...")
        return retrieved

    async def augment_llm_prompt(self, question: str, contract_id: str, context_limit: int = 3) -> str:
        """
        Create an augmented prompt for LLM using retrieved context
        
        Args:
            question: User question
            contract_id: Contract to search
            context_limit: Max context chunks
            
        Returns:
            Augmented prompt with context
        """
        # Retrieve relevant context
        retrieval = RetrievalContext(
            query=question,
            top_k=context_limit,
            filters={"contract_id": contract_id}
        )
        
        retrieved_chunks = await self.retrieve_context(retrieval)
        
        # Build augmented prompt
        context_text = "\n\n".join([
            f"[Chunk {i+1}]\n{chunk['text']}"
            for i, chunk in enumerate(retrieved_chunks)
        ])
        
        augmented_prompt = f"""You are a legal AI assistant specializing in contract analysis.

CONTEXT FROM CONTRACT:
{context_text}

QUESTION:
{question}

Provide a clear, professional answer based on the context above. If the information is not in the context, say so."""
        
        return augmented_prompt

    async def cleanup_contract(self, contract_id: str) -> bool:
        """
        Remove all embeddings for a contract (on deletion)
        
        Args:
            contract_id: Contract to remove
            
        Returns:
            Success status
        """
        try:
            await self.vector_service.delete_by_metadata({
                "contract_id": contract_id
            })
            logger.info(f"Cleaned up embeddings for contract {contract_id}")
            return True
        except Exception as e:
            logger.error(f"Failed to cleanup contract {contract_id}: {str(e)}")
            return False

    @staticmethod
    def _split_sentences(text: str) -> list[str]:
        """
        Simple sentence splitter (in production, use spaCy)
        
        Args:
            text: Text to split
            
        Returns:
            List of sentences
        """
        import re
        # Simple regex-based sentence splitting
        sentences = re.split(r'(?<=[.!?])\s+', text)
        return [s.strip() for s in sentences if s.strip()]


# Prompt Templates for RAG-based Analysis

CLAUSE_EXTRACTION_PROMPT = """
Analyze the following contract section and extract all legal clauses.

For each clause, provide:
1. Category (liability, termination, renewal, payment, etc.)
2. Risk Level (Low, Medium, High)
3. Plain English explanation
4. Recommended action

CONTRACT SECTION:
{context}

Respond in JSON format:
{{
    "clauses": [
        {{
            "category": "string",
            "text": "string",
            "risk_level": "Low|Medium|High",
            "explanation": "string",
            "suggested_action": "string"
        }}
    ]
}}
"""

RISK_ANALYSIS_PROMPT = """
Analyze the following contract clauses for legal and financial risk.

CLAUSES:
{context}

For each risk, provide:
1. Category affected
2. Severity (Low, Medium, High)
3. Business impact
4. Mitigation strategy

Respond in JSON format:
{{
    "risks": [
        {{
            "category": "string",
            "severity": "Low|Medium|High",
            "impact": "string",
            "mitigation": "string"
        }}
    ],
    "overall_risk_score": 0-100
}}
"""

OBLIGATION_EXTRACTION_PROMPT = """
Extract all obligations and key dates from this contract.

CONTRACT TEXT:
{context}

List all obligations with:
1. Description
2. Party responsible (vendor/customer/both)
3. Due date if specified
4. Priority level

Respond in JSON format:
{{
    "obligations": [
        {{
            "description": "string",
            "party": "vendor|customer|both",
            "due_date": "YYYY-MM-DD or null",
            "priority": "low|medium|high"
        }}
    ],
    "key_dates": [
        {{
            "date": "YYYY-MM-DD",
            "type": "renewal|termination|notice|payment|other",
            "description": "string"
        }}
    ]
}}
"""
