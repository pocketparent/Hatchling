class User:
    """
    Model class for users based on the schema in the specifications.
    """
    def __init__(self, user_id=None, name=None, phone_number=None, email=None, 
                 avatar=None, role="parent", permissions=None, default_privacy="private", 
                 nudge_opt_in=True, nudge_frequency="occasionally", account_created=None, 
                 last_active=None, subscription_status="trial", stripe_customer_id=None):
        """
        Initialize a new User object.
        
        Args:
            user_id: Unique identifier for the user (string)
            name: User's name (string)
            phone_number: User's phone number (string, login ID)
            email: User's email (string or null)
            avatar: User's avatar (string, URL or initial)
            role: User role (enum: parent, co_parent, caregiver)
            permissions: User permissions (enum: edit, view)
            default_privacy: Default privacy setting for entries (enum)
            nudge_opt_in: Whether user has opted in for nudges (boolean)
            nudge_frequency: Frequency of nudges (enum: daily, weekly, occasionally)
            account_created: Account creation timestamp (datetime)
            last_active: Last activity timestamp (datetime)
            subscription_status: Subscription status (enum: trial, active, inactive)
            stripe_customer_id: Stripe customer ID for billing (string)
        """
        self.user_id = user_id
        self.name = name
        self.phone_number = phone_number
        self.email = email
        self.avatar = avatar
        self.role = role
        self.permissions = permissions or ["edit"]
        self.default_privacy = default_privacy
        self.nudge_opt_in = nudge_opt_in
        self.nudge_frequency = nudge_frequency
        self.account_created = account_created
        self.last_active = last_active
        self.subscription_status = subscription_status
        self.stripe_customer_id = stripe_customer_id
    
    def to_dict(self):
        """
        Convert User object to dictionary for Firebase storage.
        
        Returns:
            Dictionary representation of the User
        """
        return {
            'user_id': self.user_id,
            'name': self.name,
            'phone_number': self.phone_number,
            'email': self.email,
            'avatar': self.avatar,
            'role': self.role,
            'permissions': self.permissions,
            'default_privacy': self.default_privacy,
            'nudge_opt_in': self.nudge_opt_in,
            'nudge_frequency': self.nudge_frequency,
            'account_created': self.account_created,
            'last_active': self.last_active,
            'subscription_status': self.subscription_status,
            'stripe_customer_id': self.stripe_customer_id
        }
    
    @classmethod
    def from_dict(cls, data):
        """
        Create User object from dictionary.
        
        Args:
            data: Dictionary containing user data
            
        Returns:
            User object
        """
        return cls(
            user_id=data.get('user_id'),
            name=data.get('name'),
            phone_number=data.get('phone_number'),
            email=data.get('email'),
            avatar=data.get('avatar'),
            role=data.get('role', 'parent'),
            permissions=data.get('permissions', ['edit']),
            default_privacy=data.get('default_privacy', 'private'),
            nudge_opt_in=data.get('nudge_opt_in', True),
            nudge_frequency=data.get('nudge_frequency', 'occasionally'),
            account_created=data.get('account_created'),
            last_active=data.get('last_active'),
            subscription_status=data.get('subscription_status', 'trial'),
            stripe_customer_id=data.get('stripe_customer_id')
        )
