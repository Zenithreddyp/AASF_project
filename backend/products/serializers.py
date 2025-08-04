from rest_framework import serializers
from .models import Products, ProductImage

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "image"]

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )

    class Meta:
        model = Products
        fields = [
            "id", "vendor", "name", "description", "price", "stock", 
            "category", "brand", "rating", 
            "images", 
            "uploaded_images"
        ]
        extra_kwargs = {"vendor": {"read_only": True}}


    def create(self, validated_data):
        uploaded_images_data = validated_data.pop("uploaded_images", [])
        
        product = Products.objects.create(**validated_data)

        for image_data in uploaded_images_data:
            ProductImage.objects.create(product=product, image=image_data)
            
        return product

    def to_representation(self, instance):   #required for showing all feilds
        rep = super().to_representation(instance)
        
        rep["images"] = ProductImageSerializer(instance.images.all(), many=True, context=self.context).data
        return rep