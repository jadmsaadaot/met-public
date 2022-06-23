"""Engagement model class.

Manages the engagement
"""
from .engagement_status import EngagementStatus
from met_api.schemas.Engagement import EngagementSchema
from datetime import datetime
from sqlalchemy import join
from sqlalchemy.sql.schema import ForeignKey
from sqlalchemy.sql import select
from sqlalchemy.dialects.postgresql import JSON
from .db import db, ma
from .default_method_result import DefaultMethodResult

class Engagement(db.Model):
    """Definition of the Engagement entity."""

    __tablename__ = 'engagement'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50))
    description = db.Column(db.Text, unique=False, nullable=False)
    rich_description = db.Column(JSON, unique=False, nullable=False)
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)
    status_id = db.Column(db.Integer, ForeignKey('engagement_status.id', ondelete='CASCADE'))
    created_date = db.Column(db.DateTime, default=datetime.utcnow())
    updated_date = db.Column(db.DateTime, onupdate=datetime.utcnow())
    published_date = db.Column(db.DateTime, nullable=True)
    user_id = db.Column(db.Integer, ForeignKey('user.id', ondelete='CASCADE'))

    @classmethod
    def get_engagement(cls, engagement_id):
        """Get an engagement."""
        engagement_schema = EngagementSchema()
        data = db.session.query(Engagement).filter_by(id=engagement_id).first()
        return engagement_schema.dump(data)

    @classmethod
    def get_all_engagements(cls):
        """Get all engagements."""
        engagements_schema = EngagementSchema(many=True)
        data = db.session.query(Engagement).join(EngagementStatus).order_by(Engagement.id.asc()).all()
        return engagements_schema.dump(data)

    @classmethod
    def create_engagement(cls, engagement) -> DefaultMethodResult:
        """Save engagement."""
        new_engagement = Engagement(
            name=engagement.get('name', None),
            description=engagement.get('description', None),
            rich_description=engagement.get('rich_description', None),
            start_date=engagement.get('start_date', None),
            end_date=engagement.get('end_date', None),
            created_date=datetime.utcnow(),
            updated_date=datetime.utcnow(),
            published_date=None
        )
        db.session.add(new_engagement)
        db.session.commit()
        return DefaultMethodResult(True, 'Engagement Added', new_engagement.id)

    @classmethod
    def update_engagement(cls, engagement) -> DefaultMethodResult:
        """Update engagement."""
        update_fields = dict(
            name=engagement.get('name', None),
            description=engagement.get('description', None),
            rich_description=engagement.get('rich_description', None),
            start_date=engagement.get('start_date', None),
            end_date=engagement.get('end_date', None),
            updated_date=datetime.utcnow()
        )
        Engagement.query.filter_by(id=engagement.get('id', None)).update(update_fields)
        db.session.commit()
        return DefaultMethodResult(True, 'Engagement Updated', engagement['id'])

