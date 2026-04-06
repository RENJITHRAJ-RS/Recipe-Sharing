from django.contrib import admin
from django.urls import path, include

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
 
    path('api/', include('Recipeadmin.urls')),
    
    path('', include('Recipeadmin.urls')), 
    
     path('superadmin/', admin.site.urls),
]

# ✅ THIS IS REQUIRED FOR IMAGES
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )
