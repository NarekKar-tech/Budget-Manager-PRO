from pydantic import BaseModel, ConfigDict, Field


class CategoryCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    color: str = "#7C3AED"
    icon: str = "Wallet"


class CategoryRead(BaseModel):
    id: int
    name: str
    color: str
    icon: str

    model_config = ConfigDict(from_attributes=True)
