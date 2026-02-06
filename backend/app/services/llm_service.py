"""
LLM Service - Large Language Model Operations
Handles GPT-4o interactions for contract analysis, summarization, and risk assessment
"""

import json
import logging
from typing import Optional
from dataclasses import dataclass
from enum import Enum

logger = logging.getLogger(__name__)


class RiskLevel(str, Enum):
    """Risk assessment levels"""
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"


@dataclass
class AnalysisResult:
    """Structured result from LLM analysis"""
    summary: str
    risk_level: RiskLevel
    risk_score: int  # 0-100
    compliance_score: int  # 0-100
    key_clauses: list[dict]
    obligations: list[dict]
    renewal_date: Optional[str] = None
    auto_renews: bool = False
    raw_response: Optional[str] = None


class LLMService:
    """
    Large Language Model Service
    
    Uses OpenAI GPT-4o for:
    - Contract summarization
    - Risk classification
    - Clause extraction & explanation
    - Obligation identification
    - Document-agnostic Q&A (via RAG)
    
    Performance Targets:
    - Summary generation: < 10s
    - Risk analysis: < 15s
    - Clause extraction: < 12s
    """

    def __init__(self, api_key: str, model: str = "gpt-4-turbo", max_tokens: int = 2000):
        """
        Initialize LLM service
        
        Args:
            api_key: OpenAI API key
            model: Model identifier (gpt-4-turbo or gpt-4o)
            max_tokens: Max completion tokens
        """
        self.api_key = api_key
        self.model = model
        self.max_tokens = max_tokens
        # OpenAI client initialization would go here
        # from openai import AsyncOpenAI
        # self.client = AsyncOpenAI(api_key=api_key)
        
    async def summarize_contract(self, text: str, vendor: str = None) -> str:
        """
        Generate executive summary of contract
        
        Args:
            text: Contract text
            vendor: Vendor/counterparty name for context
            
        Returns:
            Plain-English contract summary (200-400 words)
        """
        prompt = f"""
You are a legal expert summarizing contracts for business professionals.

TASK: Create a clear, concise executive summary of this contract suitable for a CEO or operations manager.

VENDOR: {vendor or 'Not specified'}

CONTRACT TEXT:
{text[:4000]}  # Truncate for token limits

Provide:
1. What this contract is about (1-2 sentences)
2. Key parties and obligations
3. Timeline and renewal terms
4. Any unusual or important provisions

Keep language simple and avoid legal jargon. Maximum 300 words.
"""
        
        response = await self._call_gpt(prompt)
        logger.info(f"Generated summary for contract by {vendor}")
        return response

    async def analyze_risk(self, text: str) -> tuple[RiskLevel, int]:
        """
        Classify contract risk level and generate risk score
        
        Risk Classification:
        - Low (0-33): Standard terms, minimal exposure
        - Medium (34-66): Moderate risks, normal for industry
        - High (67-100): Significant exposure, negotiate or escalate
        
        Args:
            text: Contract text
            
        Returns:
            (risk_level, risk_score) tuple
        """
        prompt = f"""
Analyze the legal and financial risk of this contract.

CONTRACT TEXT:
{text[:4000]}

Respond ONLY with valid JSON (no markdown):
{{
    "risk_level": "Low|Medium|High",
    "risk_score": 0-100,
    "primary_risks": ["risk1", "risk2", "risk3"],
    "reasoning": "brief explanation"
}}

Based on:
- Liability caps and indemnification
- Termination clauses and penalties
- Payment terms and late fees
- IP and confidentiality restrictions
- Renewal and cancellation terms
"""
        
        response = await self._call_gpt(prompt)
        
        try:
            parsed = json.loads(response)
            risk_level = RiskLevel(parsed.get("risk_level", "Medium"))
            risk_score = parsed.get("risk_score", 50)
            return risk_level, risk_score
        except Exception as e:
            logger.error(f"Failed to parse risk analysis: {str(e)}")
            return RiskLevel.MEDIUM, 50

    async def extract_clauses(self, text: str) -> list[dict]:
        """
        Extract and classify contract clauses
        
        Identifies key legal provisions and categorizes them:
        - Liability & indemnification
        - Termination & renewal
        - Confidentiality & IP
        - Payment & penalties
        - Warranties & compliance
        
        Args:
            text: Contract text
            
        Returns:
            List of extracted clauses with metadata
        """
        prompt = f"""
Extract all important legal clauses from this contract.

CONTRACT TEXT:
{text[:4000]}

For each clause found, provide:
- Category (liability, termination, renewal, payment, confidentiality, ip, warranty, compliance, other)
- Quoted text (up to 100 words)
- Plain English explanation
- Risk level (Low, Medium, High)
- Practical implications

Respond ONLY with valid JSON:
{{
    "clauses": [
        {{
            "category": "string",
            "quote": "string",
            "explanation": "string",
            "risk_level": "Low|Medium|High",
            "implications": "string"
        }}
    ],
    "total_clauses": number
}}
"""
        
        response = await self._call_gpt(prompt)
        
        try:
            parsed = json.loads(response)
            return parsed.get("clauses", [])
        except Exception as e:
            logger.error(f"Failed to extract clauses: {str(e)}")
            return []

    async def identify_obligations(self, text: str) -> list[dict]:
        """
        Identify party obligations and key dates
        
        Args:
            text: Contract text
            
        Returns:
            List of obligations with dates and responsible party
        """
        prompt = f"""
Identify all obligations and key dates in this contract.

CONTRACT TEXT:
{text[:4000]}

List each obligation with:
- Description
- Responsible party (Vendor, Customer, or Both)
- Due date if specified
- Consequence of non-compliance

Also identify key dates for:
- Renewal or extension windows
- Termination notice requirements
- Payment schedules
- Compliance audits

Respond ONLY with valid JSON:
{{
    "obligations": [
        {{
            "description": "string",
            "party": "Vendor|Customer|Both",
            "due_date": "YYYY-MM-DD or null",
            "consequence": "string",
            "priority": "Low|Medium|High"
        }}
    ],
    "key_dates": [
        {{
            "date": "YYYY-MM-DD or 'relative' (e.g., 90 days before renewal)",
            "type": "renewal|termination|notice|payment|compliance|other",
            "description": "string"
        }}
    ]
}}
"""
        
        response = await self._call_gpt(prompt)
        
        try:
            parsed = json.loads(response)
            return parsed.get("obligations", [])
        except Exception as e:
            logger.error(f"Failed to identify obligations: {str(e)}")
            return []

    async def answer_question(self, question: str, context: str) -> str:
        """
        Answer questions about a contract using RAG context
        
        Args:
            question: User question
            context: Retrieved relevant passages from contract
            
        Returns:
            Answer with explanations
        """
        prompt = f"""
Answer this question about the contract based on the provided context.

CONTEXT FROM CONTRACT:
{context}

QUESTION:
{question}

Provide:
1. Direct answer
2. Key clause or section reference
3. Practical implications
4. Recommended action if applicable

If the answer isn't in the provided context, say "This information is not addressed in the provided contract sections."
"""
        
        response = await self._call_gpt(prompt)
        return response

    async def embed_text(self, text: str) -> list[float]:
        """
        Create embedding vector for text (for RAG retrieval)
        
        Args:
            text: Text to embed
            
        Returns:
            Embedding vector
        """
        # In production: client.embeddings.create(model="text-embedding-3-large", input=text)
        # Returning mock vector for now
        import random
        return [random.random() for _ in range(1536)]  # OpenAI embedding dimension

    async def _call_gpt(self, prompt: str) -> str:
        """
        Internal method to call GPT-4o API
        
        Args:
            prompt: Full prompt text
            
        Returns:
            Model response
        """
        logger.debug(f"Calling GPT-4o with prompt length: {len(prompt)}")
        
        # In production:
        # response = await self.client.chat.completions.create(
        #     model=self.model,
        #     messages=[{"role": "user", "content": prompt}],
        #     max_tokens=self.max_tokens,
        #     temperature=0.2  # Low temperature for consistency
        # )
        # return response.choices[0].message.content
        
        # Mock response for demo
        return '{"status": "mock", "message": "Production LLM integration required"}'

    async def generate_compliance_report(self, analysis_results: list[dict]) -> str:
        """
        Generate compliance summary across multiple contracts
        
        Args:
            analysis_results: List of contract analyses
            
        Returns:
            Compliance summary and recommendations
        """
        prompt = f"""
Generate a compliance summary across {len(analysis_results)} contracts.

Summary of findings:
{json.dumps(analysis_results, indent=2)}

Provide:
1. Compliance gaps and risks
2. Priority remediation items
3. Industry-standard best practices
4. Recommended contract amendments
"""
        return await self._call_gpt(prompt)


# AI Prompts for Common Tasks

SYSTEM_PROMPT = """
You are ContractGuard, an expert AI legal analyst specializing in contract intelligence.
Your role is to help business professionals (not lawyers) understand contracts quickly.

Guidelines:
- Use clear, simple language (avoid legalese)
- Focus on business impact, not legal theory
- Highlight risks and action items
- Provide practical recommendations
- Be concise but thorough
- Always cite relevant contract sections
"""

REDLINE_SUGGESTION_PROMPT = """
Based on this contract analysis, suggest specific amendments or redlines.

CURRENT TERMS:
{current_terms}

RISKS IDENTIFIED:
{risks}

BEST PRACTICES:
{best_practices}

Propose:
1. Specific language changes
2. Additions or deletions
3. Conditions to negotiate
4. Market-standard alternatives

Note: These are suggestions only. Consult legal counsel before negotiating.
"""
