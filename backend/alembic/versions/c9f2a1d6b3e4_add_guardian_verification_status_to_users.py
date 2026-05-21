"""add_guardian_verification_status_to_users

Revision ID: c9f2a1d6b3e4
Revises: b7f3c2d4e5f6
Create Date: 2026-05-21

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "c9f2a1d6b3e4"
down_revision = "b7f3c2d4e5f6"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column(
            "guardian_verification_status",
            sa.String(),
            nullable=True,
            server_default="not_submitted"
        )
    )
    op.execute(
        "UPDATE users SET guardian_verification_status = 'not_submitted' "
        "WHERE guardian_verification_status IS NULL"
    )
    op.alter_column("users", "guardian_verification_status", nullable=False)


def downgrade() -> None:
    op.drop_column("users", "guardian_verification_status")
