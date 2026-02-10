from django.urls import path
from .views import (
    #RegisterAPIView, 
    LoginAPIView, 
    LogoutAPIView, 
    MeAPIView, 
    ChangePasswordAPI,
    # CreateDatasetAPI,
    # UpdateDatasetAPI,
    # StatisticsAPI,
    # UserPresetAPI,
    # SharedPresetCreateAPI,
    # SharedPresetDeleteAPI,
    # CreateFormFieldAPI,
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
    #path('register/', RegisterAPIView.as_view()),
    path('login/', LoginAPIView.as_view()),
    path('logout/', LogoutAPIView.as_view()),
    path('me/', MeAPIView.as_view()),
    path('change-password/', ChangePasswordAPI.as_view()),

    # Rollen und was sie dürfen
    # path("datasets/", CreateDatasetAPI.as_view()),
    # path("datasets/<int:dataset_id>/", UpdateDatasetAPI.as_view()),
    # path("statistics/", StatisticsAPI.as_view()),
    # path("presets/", UserPresetAPI.as_view()),
    # path("presets/shared/", SharedPresetCreateAPI.as_view()),
    # path("presets/shared/<int:preset_id>/", SharedPresetDeleteAPI.as_view()),
    # path("form-fields/", CreateFormFieldAPI.as_view()),

    # Admin
    path('admin/users/register/', AdminUserRegisterAPI.as_view()),
    path('admin/users/', AdminUserListAPI.as_view()),
    path('admin/users/<int:user_id>/', AdminUserDeleteAPI.as_view()),
    path('admin/users/<int:user_id>/reset-password/', AdminResetPasswordAPI.as_view()),
    path('admin/users/<int:user_id>/role/', AdminChangeRoleAPI.as_view()),
]