from pydantic import BaseModel
from typing import List, Optional

class AIActCompliance(BaseModel):
    risk_level: str
    underlying_model: str
    data_processed: str
    eu_data_residency: bool
    audit_log: bool

class Agent(BaseModel):
    id: str
    name: str
    role: str
    skills: List[str]
    use_cases: List[str]
    price_credits: int
    compliance: AIActCompliance
    is_hired: bool = False
    probation_mode: bool = False
    status: str = "available"
    dossier: List[dict] = []
    hired_at: Optional[str] = None
    is_official: bool = False
    creator_email: Optional[str] = None
    hire_count: int = 0
    avg_rating: float = 0.0
    rating_count: int = 0

class DailyBriefing(BaseModel):
    yesterday: str
    today: str
    blockers: str = "No blockers identified."

class Specialization(BaseModel):
    date: str
    skill_acquired: str

class AgentPerformance(BaseModel):
    agent_id: str
    agent_name: str = ""
    hired_at: Optional[str] = None
    days_active: int = 0
    task_count: int = 0
    specializations: List[Specialization]

class UserCreate(BaseModel):
    email: str
    password: str
    company_name: str

class UserInDB(BaseModel):
    email: str
    hashed_password: str
    company_name: str
    credit_balance: int = 100

class Token(BaseModel):
    access_token: str
    token_type: str

class TaskRequest(BaseModel):
    task_description: str

class TaskResponse(BaseModel):
    result: str
    delegated: bool = False
    delegated_to: str = ""
    task_id: str = ""
    pending_approval: bool = False
    escalation: Optional[dict] = None

class EscalationReply(BaseModel):
    manager_response: str

class AgentCreate(BaseModel):
    name: str
    role: str
    skills: List[str]
    use_cases: List[str]
    price_credits: int
    underlying_model: Optional[str] = "gemini-2.5-flash"

class TranscribeResponse(BaseModel):
    result: str
    transcribed_by: str
    briefed_agents: List[str]

class Notification(BaseModel):
    id: str
    type: str
    message: str
    read: bool = False
    created_at: str

class AgentRating(BaseModel):
    id: str
    agent_id: str
    user_email: str
    stars: int
    review: str = ""
    created_at: str

class RatingRequest(BaseModel):
    stars: int
    review: str = ""

class TopUpRequest(BaseModel):
    amount: int

class UpdateProfile(BaseModel):
    company_name: Optional[str] = None

class ChangePassword(BaseModel):
    current_password: str
    new_password: str

class DossierEdit(BaseModel):
    skill_acquired: str

class TaskHistoryItem(BaseModel):
    task_id: str
    agent_id: str
    agent_name: str = ""
    task_description: str
    result: str
    timestamp: str
    delegated: bool = False
    pending_approval: bool = False
