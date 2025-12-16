"""add_profile_table

Revision ID: 94297d142966
Revises: 8a6025fe2402
Create Date: 2025-12-16 18:32:08.017404

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '94297d142966'
down_revision: Union[str, None] = '8a6025fe2402'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'profiles',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=False),
        
        # Personal Information
        sa.Column('location', sa.String(), nullable=True),
        sa.Column('academic_background', sa.String(), nullable=True),
        sa.Column('profession', sa.String(), nullable=True),
        sa.Column('marital_status', sa.String(), nullable=True),
        sa.Column('hobbies', sa.Text(), nullable=True),
        sa.Column('intro_video', sa.String(), nullable=True),
        
        # Health Information
        sa.Column('medical_history', sa.Text(), nullable=True),
        sa.Column('overall_health_status', sa.String(), nullable=True),
        sa.Column('long_term_condition', sa.String(), nullable=True),
        sa.Column('long_term_condition_description', sa.Text(), nullable=True),
        sa.Column('blood_group', sa.String(), nullable=True),
        sa.Column('genetic_conditions', sa.Text(), nullable=True),
        sa.Column('fertility_awareness', sa.String(), nullable=True),
        sa.Column('disability', sa.String(), nullable=True),
        sa.Column('disability_description', sa.Text(), nullable=True),
        sa.Column('medical_documents', sa.String(), nullable=True),
        
        # Physical Attributes
        sa.Column('height', sa.Float(), nullable=True),
        sa.Column('weight', sa.Float(), nullable=True),
        
        # Lifestyle & Habits
        sa.Column('dietary_preference', sa.String(), nullable=True),
        sa.Column('smoking_habit', sa.String(), nullable=True),
        sa.Column('alcohol_consumption', sa.String(), nullable=True),
        sa.Column('chronic_illness', sa.String(), nullable=True),
        sa.Column('interests', sa.Text(), nullable=True),
        
        # Profile Picture
        sa.Column('profile_picture', sa.String(), nullable=True),
        
        # Partner and Marriage Preferences
        sa.Column('preferred_age_min', sa.Integer(), nullable=True),
        sa.Column('preferred_age_max', sa.Integer(), nullable=True),
        sa.Column('preferred_height_min', sa.Float(), nullable=True),
        sa.Column('preferred_height_max', sa.Float(), nullable=True),
        sa.Column('preferred_weight_min', sa.Float(), nullable=True),
        sa.Column('preferred_weight_max', sa.Float(), nullable=True),
        sa.Column('preferred_religion', sa.String(), nullable=True),
        sa.Column('preferred_education', sa.String(), nullable=True),
        sa.Column('preferred_profession', sa.String(), nullable=True),
        sa.Column('preferred_location', sa.String(), nullable=True),
        sa.Column('specific_location', sa.String(), nullable=True),
        sa.Column('willing_to_relocate', sa.Boolean(), nullable=True),
        
        # Lifestyle Preferences for Partner
        sa.Column('lifestyle_pref_smoking', sa.String(), nullable=True),
        sa.Column('lifestyle_pref_alcohol', sa.String(), nullable=True),
        sa.Column('lifestyle_pref_dietary_match', sa.Boolean(), nullable=True),
        
        sa.Column('living_with_in_laws', sa.String(), nullable=True),
        sa.Column('career_support_expectations', sa.Text(), nullable=True),
        sa.Column('necessary_preferences', sa.Text(), nullable=True),
        sa.Column('additional_comments', sa.Text(), nullable=True),
        
        # System fields
        sa.Column('is_completed', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.UniqueConstraint('user_id')
    )


def downgrade() -> None:
    op.drop_table('profiles')
