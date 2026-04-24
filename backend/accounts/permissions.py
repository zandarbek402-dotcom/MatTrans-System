from rest_framework import permissions


class IsAdminOrReadOnly(permissions.BasePermission):
    """Permission class: Admin can do everything, anyone can read (even without auth)"""
    
    def has_permission(self, request, view):
        # Оқу операцияларына кірусіз рұқсат (GET, HEAD, OPTIONS)
        if request.method in permissions.SAFE_METHODS:
            return True
        # Жазу операцияларына тек тіркелген admin керек
        return request.user.is_authenticated and request.user.is_admin


class IsAdmin(permissions.BasePermission):
    """Permission class: Only admin can access"""
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_admin


