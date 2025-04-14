import os
import stripe
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class StripeService:
    """
    Service class for Stripe operations including subscription management and checkout.
    """
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(StripeService, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance
    
    def _initialize(self):
        """Initialize Stripe client with API key from environment variables."""
        try:
            # Get Stripe API key from environment variables
            stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
            self.webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
            self.monthly_price_id = os.getenv("STRIPE_MONTHLY_PRICE_ID")
            self.annual_price_id = os.getenv("STRIPE_ANNUAL_PRICE_ID")
            
            print("Stripe service initialized successfully")
        except Exception as e:
            print(f"Error initializing Stripe service: {e}")
            # In production, would use proper logging
    
    def create_customer(self, name, email=None, phone=None):
        """
        Create a new Stripe customer.
        
        Args:
            name: Customer name
            email: Customer email (optional)
            phone: Customer phone number (optional)
            
        Returns:
            Stripe customer ID if successful, None otherwise
        """
        try:
            customer_data = {
                "name": name
            }
            
            if email:
                customer_data["email"] = email
            if phone:
                customer_data["phone"] = phone
                
            customer = stripe.Customer.create(**customer_data)
            return customer.id
        except Exception as e:
            print(f"Error creating Stripe customer: {e}")
            return None
    
    def create_checkout_session(self, customer_id, price_id=None, success_url=None, cancel_url=None):
        """
        Create a Stripe Checkout session for subscription.
        
        Args:
            customer_id: Stripe customer ID
            price_id: Stripe price ID (monthly or annual)
            success_url: URL to redirect after successful checkout
            cancel_url: URL to redirect after cancelled checkout
            
        Returns:
            Checkout session URL if successful, None otherwise
        """
        try:
            # Use monthly price ID by default if not specified
            if not price_id:
                price_id = self.monthly_price_id
                
            # Set default URLs if not provided
            base_url = os.getenv("BASE_URL", "https://myhatchling.ai") 
            if not success_url:
                success_url = f"{base_url}/subscription/success"
            if not cancel_url:
                cancel_url = f"{base_url}/subscription/cancel"
                
            # Create checkout session
            session = stripe.checkout.Session.create(
                customer=customer_id,
                payment_method_types=["card"],
                line_items=[
                    {
                        "price": price_id,
                        "quantity": 1
                    }
                ],
                mode="subscription",
                success_url=success_url,
                cancel_url=cancel_url,
                subscription_data={
                    "trial_period_days": 14
                }
            )
            
            return session.url
        except Exception as e:
            print(f"Error creating checkout session: {e}")
            return None
    
    def handle_webhook(self, payload, signature):
        """
        Handle Stripe webhook events.
        
        Args:
            payload: Webhook request body
            signature: Stripe signature header
            
        Returns:
            Tuple of (event_type, event_data) if successful, (None, None) otherwise
        """
        try:
            # Verify webhook signature
            event = stripe.Webhook.construct_event(
                payload, signature, self.webhook_secret
            )
            
            # Extract event type and data
            event_type = event["type"]
            event_data = event["data"]["object"]
            
            return event_type, event_data
        except Exception as e:
            print(f"Error handling webhook: {e}")
            return None, None
    
    def handle_subscription_event(self, event_data):
        """
        Handle subscription-related webhook events.
        
        Args:
            event_data: Stripe event data object
            
        Returns:
            Dictionary with subscription details if successful, empty dict otherwise
        """
        try:
            subscription_id = event_data.get("id")
            customer_id = event_data.get("customer")
            status = event_data.get("status")
            current_period_end = event_data.get("current_period_end")
            
            # Process subscription data
            subscription_details = {
                "subscription_id": subscription_id,
                "customer_id": customer_id,
                "status": status,
                "current_period_end": current_period_end,
                "is_active": status in ["active", "trialing"]
            }
            
            return subscription_details
        except Exception as e:
            print(f"Error handling subscription event: {e}")
            return {}
    
    def get_subscription_status(self, subscription_id):
        """
        Get current status of a subscription.
        
        Args:
            subscription_id: Stripe subscription ID
            
        Returns:
            Subscription status if successful, None otherwise
        """
        try:
            subscription = stripe.Subscription.retrieve(subscription_id)
            return subscription.status
        except Exception as e:
            print(f"Error getting subscription status: {e}")
            return None
