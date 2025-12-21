"""add recent image columns to users table

Revision ID: add_recent_image_cols
Revises: 8106eda9eddc
Create Date: 2025-12-21

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_recent_image_cols'
down_revision = '8106eda9eddc'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add recent image columns to users table
    op.add_column('users', sa.Column('recent_image_data', sa.LargeBinary(), nullable=True))
    op.add_column('users', sa.Column('recent_image_filename', sa.String(), nullable=True))
    op.add_column('users', sa.Column('recent_image_content_type', sa.String(), nullable=True))


def downgrade() -> None:
    # Remove recent image columns from users table
    op.drop_column('users', 'recent_image_content_type')
    op.drop_column('users', 'recent_image_filename')
    op.drop_column('users', 'recent_image_data')
