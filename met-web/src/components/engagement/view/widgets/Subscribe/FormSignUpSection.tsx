import React from 'react';
import { SecondaryButton } from 'components/common';
import { Grid, Link } from '@mui/material';
import { SubscribeForm, CallToActionType } from 'models/subscription';
import { When } from 'react-if';
import { getEditorStateFromRaw } from 'components/common/RichTextEditor/utils';
import { Editor } from 'react-draft-wysiwyg';
import { Widget } from 'models/widget';
import { useAppSelector } from 'hooks';

const FormSignUpSection = ({ subscribeOption, widget }: { subscribeOption: SubscribeForm; widget: Widget }) => {
    const tenant = useAppSelector((state) => state.tenant);
    const handleNavigate = () => {
        window.open(`/${tenant.basename}/engagements/${widget.engagement_id}/cacform/${widget.id}`, '_blank');
    };
    return (
        <Grid spacing={2} container item xs={12}>
            <Grid
                item
                xs={12}
                sx={{
                    position: 'relative',
                    height: 'auto',
                    marginTop: -1,
                }}
                style={{ paddingTop: 0 }}
            >
                <Editor
                    editorState={getEditorStateFromRaw(subscribeOption.subscribe_items[0].rich_description || '')}
                    readOnly={true}
                    toolbarHidden
                />
            </Grid>
            <Grid container item xs={12} justifyContent={'flex-end'}>
                <When condition={subscribeOption.subscribe_items[0].call_to_action_type == CallToActionType.BUTTON}>
                    <Grid container xs={12} direction="row" justifyContent="flex-end">
                        <SecondaryButton onClick={handleNavigate}>
                            {subscribeOption.subscribe_items[0].call_to_action_text}
                        </SecondaryButton>
                    </Grid>
                </When>
                <When condition={subscribeOption.subscribe_items[0].call_to_action_type == CallToActionType.LINK}>
                    <Grid item xs={12}>
                        <Link onClick={handleNavigate} sx={{ cursor: 'pointer' }}>
                            {subscribeOption.subscribe_items[0].call_to_action_text}
                        </Link>
                    </Grid>
                </When>
            </Grid>
        </Grid>
    );
};

export default FormSignUpSection;
