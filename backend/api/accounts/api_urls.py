from django.urls import path
from .views import (
    LoginAPIView, 
    LogoutAPIView, 
    MeAPIView, 
    ChangePasswordAPI,
)
from .admin_api import (
    AdminUserRegisterAPI,
    AdminUserListAPI, 
    AdminUserDeleteAPI, 
    AdminResetPasswordAPI, 
    AdminChangeRoleAPI,
)

urlpatterns = [
    # Authentication
    path('login/', LoginAPIView.as_view()),
    path('logout/', LogoutAPIView.as_view()),
    path('me/', MeAPIView.as_view()),
    path('change-password/', ChangePasswordAPI.as_view()),

    # Admin
    path('admin/users/register/', AdminUserRegisterAPI.as_view()),
    path('admin/users/', AdminUserListAPI.as_view()),
    path('admin/users/<int:user_id>/delete/', AdminUserDeleteAPI.as_view()),
    path('admin/users/<int:user_id>/reset-password/', AdminResetPasswordAPI.as_view()),
    path('admin/users/<int:user_id>/role/', AdminChangeRoleAPI.as_view()),
]