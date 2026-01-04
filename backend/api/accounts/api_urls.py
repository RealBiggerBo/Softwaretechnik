from django.urls import path
from .views import RegisterAPIView, LoginAPIView, LogoutAPIView, MeAPIView, ChangePasswordAPI
from .admin_api import AdminUserListAPI, AdminUserDeleteAPI, AdminResetPasswordAPI 

urlpatterns = [
    # Authentication
    path('register/', RegisterAPIView.as_view()),
    path('login/', LoginAPIView.as_view()),
    path('logout/', LogoutAPIView.as_view()),
    path('me/', MeAPIView.as_view()),
    path('change-password/', ChangePasswordAPI.as_view()),

    # Admin
    path('admin/users/', AdminUserListAPI.as_view()),
    path('admin/users/<int:user_id>/', AdminUserDeleteAPI.as_view()),
    path('admin/users/<int:user_id>/reset-password/', AdminResetPasswordAPI.as_view()),
]