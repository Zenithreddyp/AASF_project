from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from django.core.files.base import ContentFile
from .models import Orders, Cartitem


class InvoiceGenerator:
    def __init__(self, order):
        self.order = order
        self.buffer = BytesIO()

    def generate(self):
        p = canvas.Canvas(self.buffer, pagesize=A4)
        width, height = A4
        y = height - 50

        # Header
        p.setFont("Helvetica-Bold", 20)
        p.drawString(50, y, "ZEDOVA")
        y -= 30
        p.setFont("Helvetica", 12)
        p.drawString(50, y, "Online E-commerce Store")
        y -= 20
        p.drawString(50, y, f"Invoice ID: #INV{self.order.id}")
        y -= 20
        p.drawString(50, y, f"Date: {self.order.bought_at.strftime('%Y-%m-%d')}")
        y -= 20
        p.drawString(50, y, f"Shipping Address: {self.order.shipping_address}")
        y -= 40

        # Table headers
        p.setFont("Helvetica-Bold", 12)
        p.drawString(50, y, "Product")
        p.drawString(250, y, "Qty")
        p.drawString(300, y, "Price")
        p.drawString(400, y, "Total")
        y -= 20

        # Table data
        p.setFont("Helvetica", 12)
        items = Cartitem.objects.filter(cart=self.order.cart)
        for item in items:
            p.drawString(50, y, item.product.name)
            p.drawString(250, y, str(item.quantity))
            p.drawString(300, y, f"₹{item.product.price}")
            p.drawString(400, y, f"₹{item.total_price}")
            y -= 20

        # Total
        y -= 20
        p.setFont("Helvetica-Bold", 12)
        p.drawString(300, y, "Grand Total:")
        p.drawString(400, y, f"₹{self.order.total_price}")
        y -= 40

        # Footer
        p.setFont("Helvetica-Oblique", 10)
        p.drawString(50, 50, "Thank you for shopping with ZEDOVA!")

        p.showPage()
        p.save()
        self.buffer.seek(0)

        return self.buffer

    def save_to_order(self):
        pdf_file = self.generate()
        filename = f'invoice_ZEDOVA_{self.order.id}.pdf'
        self.order.invoice.save(filename, ContentFile(pdf_file.read()))
        self.order.save()
        return self.order.invoice.url
