from fastapi import HTTPException, status

def require_role(role: str):
    def role_checker(user):
        if user.role != role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have access to this resource"
            )
        return user
    return role_checker
