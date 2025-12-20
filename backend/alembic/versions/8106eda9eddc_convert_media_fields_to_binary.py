"""convert_media_fields_to_binary

Revision ID: 8106eda9eddc
Revises: 94297d142966
Create Date: 2025-12-16 21:11:18.560331

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8106eda9eddc'
down_revision: Union[str, None] = '94297d142966'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Drop old varchar columns
    op.drop_column('profiles', 'intro_video')
    op.drop_column('profiles', 'medical_documents')
    op.drop_column('profiles', 'profile_picture')
    
    # Add new binary columns for intro video
    op.add_column('profiles', sa.Column('intro_video_data', sa.LargeBinary(), nullable=True))
    op.add_column('profiles', sa.Column('intro_video_filename', sa.String(), nullable=True))
    op.add_column('profiles', sa.Column('intro_video_content_type', sa.String(), nullable=True))
    
    # Add new binary columns for medical documents
    op.add_column('profiles', sa.Column('medical_documents_data', sa.LargeBinary(), nullable=True))
    op.add_column('profiles', sa.Column('medical_documents_filename', sa.String(), nullable=True))
    op.add_column('profiles', sa.Column('medical_documents_content_type', sa.String(), nullable=True))
    
    # Add new binary columns for profile picture
    op.add_column('profiles', sa.Column('profile_picture_data', sa.LargeBinary(), nullable=True))
    op.add_column('profiles', sa.Column('profile_picture_filename', sa.String(), nullable=True))
    op.add_column('profiles', sa.Column('profile_picture_content_type', sa.String(), nullable=True))


def downgrade() -> None:
    # Remove binary columns
    op.drop_column('profiles', 'intro_video_data')
    op.drop_column('profiles', 'intro_video_filename')
    op.drop_column('profiles', 'intro_video_content_type')
    
    op.drop_column('profiles', 'medical_documents_data')
    op.drop_column('profiles', 'medical_documents_filename')
    op.drop_column('profiles', 'medical_documents_content_type')
    
    op.drop_column('profiles', 'profile_picture_data')
    op.drop_column('profiles', 'profile_picture_filename')
    op.drop_column('profiles', 'profile_picture_content_type')
    
    # Restore old varchar columns
    op.add_column('profiles', sa.Column('intro_video', sa.String(), nullable=True))
    op.add_column('profiles', sa.Column('medical_documents', sa.String(), nullable=True))
    op.add_column('profiles', sa.Column('profile_picture', sa.String(), nullable=True))
