"""Add messages table for match chat

Revision ID: c1f2d9b8a7e6
Revises: 50868fc3a3b6
Create Date: 2026-04-04

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c1f2d9b8a7e6'
down_revision: Union[str, None] = '50868fc3a3b6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'messages',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('from_user_id', sa.String(), nullable=False),
        sa.Column('to_user_id', sa.String(), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('is_read', sa.Boolean(), nullable=False, server_default=sa.text('false')),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['from_user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['to_user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_index('ix_messages_from_to_created', 'messages', ['from_user_id', 'to_user_id', 'created_at'])
    op.create_index('ix_messages_to_is_read', 'messages', ['to_user_id', 'is_read'])


def downgrade() -> None:
    op.drop_index('ix_messages_to_is_read', table_name='messages')
    op.drop_index('ix_messages_from_to_created', table_name='messages')
    op.drop_table('messages')
