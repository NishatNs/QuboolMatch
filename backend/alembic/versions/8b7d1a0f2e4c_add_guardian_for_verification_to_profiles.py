"""add guardian for verification to profiles table

Revision ID: 8b7d1a0f2e4c
Revises: 2f4a9e1b7c33
Create Date: 2026-06-22

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "8b7d1a0f2e4c"
down_revision: Union[str, None] = "2f4a9e1b7c33"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("profiles", sa.Column("guardian_for_verification", sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column("profiles", "guardian_for_verification")
