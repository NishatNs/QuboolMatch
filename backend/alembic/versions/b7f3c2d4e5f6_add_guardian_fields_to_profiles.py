"""add_guardian_fields_to_profiles

Revision ID: b7f3c2d4e5f6
Revises: add_recent_image_cols
Create Date: 2026-05-20

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "b7f3c2d4e5f6"
down_revision = "add_recent_image_cols"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("profiles", sa.Column("guardian_name", sa.String(), nullable=True))
    op.add_column("profiles", sa.Column("guardian_relation", sa.String(), nullable=True))
    op.add_column("profiles", sa.Column("guardian_relation_other", sa.String(), nullable=True))
    op.add_column("profiles", sa.Column("guardian_contact_number", sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column("profiles", "guardian_contact_number")
    op.drop_column("profiles", "guardian_relation_other")
    op.drop_column("profiles", "guardian_relation")
    op.drop_column("profiles", "guardian_name")
