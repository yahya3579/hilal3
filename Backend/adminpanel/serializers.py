from rest_framework import serializers
from .models import Comments, Articles, Billboards, Ebook, Magazines, Authors, Videos, Publications, Categories, Contributors

class CommentSerializer(serializers.ModelSerializer):
    user_first_name = serializers.CharField(source="user.fname", read_only=True)
    user_last_name = serializers.CharField(source="user.lname", read_only=True)
    article_title = serializers.CharField(source="article.title", read_only=True)

    class Meta:
        model = Comments
        fields = ['id', 'comment', 'user', 'user_first_name', 'user_last_name', 'article', 'article_title', 'created_at', 'rating']
        read_only_fields = ['id', 'created_at']

class ArticleSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_display_name = serializers.CharField(source='category.display_name', read_only=True)
    publication_name = serializers.CharField(source='publication.name', read_only=True)
    publication_display_name = serializers.CharField(source='publication.display_name', read_only=True)
    magazine_title = serializers.CharField(source='magazine.title', read_only=True)
    author_name = serializers.CharField(source='author.author_name', read_only=True)
    author_image = serializers.CharField(source='author.author_image', read_only=True)
    
    class Meta:
        model = Articles
        fields = ['id', 'author', 'publication', 'magazine', 'category', 'category_name', 'category_display_name', 'publication_name', 'publication_display_name', 'magazine_title', 'cover_image', 'title', 'publish_date', 'publish_date_year', 'publish_date_month', 'visits', 'issue_new', 'status', 'description', 'section', 'author_name', 'author_image']
        read_only_fields = ['id', 'category_name', 'category_display_name', 'publication_name', 'publication_display_name', 'magazine_title', 'author_name', 'author_image']
        extra_kwargs = {
            'author': {'required': False},
            'publication': {'required': False},
            'magazine': {'required': False},
            'category': {'required': False},
            'cover_image': {'required': False},
            'title': {'required': True},
            'publish_date': {'required': False},
            'publish_date_year': {'required': False},
            'publish_date_month': {'required': False},
            'visits': {'required': False},
            'issue_new': {'required': False},
            'status': {'required': False},
            'description': {'required': False},
            'section': {'required': False},
        }

class BillboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Billboards
        fields = ['id', 'user', 'image', 'title', 'created', 'location', 'issue_news', 'status']
        read_only_fields = ['id']

class MagazineSerializer(serializers.ModelSerializer):
    publication_name = serializers.CharField(source='publication.name', read_only=True)
    publication_display_name = serializers.CharField(source='publication.display_name', read_only=True)
    
    class Meta:
        model = Magazines
        fields = ['id', 'title', 'publish_date', 'language', 'direction', 'status', 'cover_image', 'doc_url', 'publication', 'publication_name', 'publication_display_name', 'year', 'month']
        read_only_fields = ['id', 'publication_name', 'publication_display_name']
    
class EbookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ebook
        fields = ['id', 'title', 'publish_date', 'language', 'direction', 'status', 'cover_image', 'is_archived','doc_url']
        read_only_fields = ['id']


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Authors
        fields = ['id', 'author_image', 'author_name', 'email', 'contact_no', 'no_of_articles', 'status', 'category', 'introduction']
        read_only_fields = ['id']


class VideosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Videos
        fields = ['id', 'title', 'youtube_url', 'video_id', 'thumbnail_url', 'description', 'status', 'language', 'created_at', 'updated_at', 'order']
        read_only_fields = ['id', 'video_id', 'thumbnail_url', 'created_at', 'updated_at']

class PublicationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publications
        fields = ['id', 'name', 'display_name', 'cover_image', 'description', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class CategoriesSerializer(serializers.ModelSerializer):
    publication_name = serializers.CharField(source='publication.name', read_only=True)
    
    class Meta:
        model = Categories
        fields = ['id', 'name', 'display_name', 'publication', 'publication_name', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'publication_name', 'created_at', 'updated_at']


class ContributorsSerializer(serializers.ModelSerializer):
    publication_name = serializers.CharField(source='publication.name', read_only=True)
    publication_display_name = serializers.CharField(source='publication.display_name', read_only=True)
    
    class Meta:
        model = Contributors
        fields = ['id', 'publication', 'publication_name', 'publication_display_name', 'name', 'designation', 'about', 'cover_image', 'order', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'publication_name', 'publication_display_name', 'created_at', 'updated_at']
