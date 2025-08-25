from fastapi import HTTPException, status, Depends
from .auth import get_current_user

def require_role(role: str):
    def role_checker(user=Depends(get_current_user)):
        user_roles = [r.name for r in user.roles]  # get list of role names
        if role not in user_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have access to this resource"
            )
        return user
    return role_checker
