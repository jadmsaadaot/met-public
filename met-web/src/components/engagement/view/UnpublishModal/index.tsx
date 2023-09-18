import React, { useContext, useState } from 'react';
import { Grid, Stack, Modal } from '@mui/material';
import { modalStyle, PrimaryButton, SecondaryButton, MetHeader1, MetBody } from 'components/common';
import { EngagementStatus } from 'constants/engagementStatus';
import { ActionContext } from 'components/engagement/view/ActionContext';

interface UnpublishModalProps {
    open: boolean;
    setModalOpen: (open: boolean) => void;
}

const UnpublishModal = ({ open, setModalOpen }: UnpublishModalProps) => {
    const { savedEngagement, unpublishEngagement } = useContext(ActionContext);
    const [isUnpublishing, setIsUnpublishing] = useState(false);

    const handleUnpublishEngagement = async () => {
        try {
            setIsUnpublishing(true);
            await unpublishEngagement({ id: savedEngagement.id, status_id: EngagementStatus.Unpublished });
            setIsUnpublishing(false);
            setModalOpen(false);
        } catch (error) {
            setIsUnpublishing(false);
            setModalOpen(false);
        }
    };

    return (
        <Modal open={open} onClose={() => setModalOpen(false)}>
            <Grid
                data-testid={'unpublish-modal'}
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="space-between"
                sx={{ ...modalStyle }}
                rowSpacing={2}
            >
                <Grid container direction="row" item xs={12}>
                    <Grid item xs={12}>
                        <MetHeader1 bold sx={{ mb: 2 }}>
                            Unpublish Engagement
                        </MetHeader1>
                    </Grid>
                </Grid>
                <Grid container direction="row" item xs={12}>
                    <Grid item xs={12}>
                        <MetBody sx={{ mb: 1 }}>This Engagement will be unpublished:</MetBody>
                    </Grid>
                    <Grid item xs={12}>
                        <ul>
                            <li>
                                <MetBody>The engagement card will be removed from the home page.</MetBody>
                            </li>
                            <li>
                                <MetBody>
                                    The engagement page and the survey won't be visible to the public anymore.
                                </MetBody>
                            </li>
                            <li>
                                <MetBody>
                                    If the engagement was open, the survey won't be accessible to the public anymore.
                                </MetBody>
                            </li>
                            <li>
                                <MetBody>
                                    The report and approved comments will be accessible internally only. You will have
                                    two weeks to review new comments. All comments not reviewed, rejected, or labelled
                                    as "needs further review" will be deleted on "two weeks from today date".
                                </MetBody>
                            </li>
                        </ul>
                    </Grid>

                    <Grid
                        item
                        container
                        xs={12}
                        direction="row"
                        justifyContent="flex-end"
                        spacing={1}
                        sx={{ mt: '1em' }}
                    >
                        <Stack
                            direction={{ md: 'column-reverse', lg: 'row' }}
                            spacing={1}
                            width="100%"
                            justifyContent="flex-end"
                        >
                            <SecondaryButton onClick={() => setModalOpen(false)}>Cancel</SecondaryButton>
                            <PrimaryButton
                                type="submit"
                                variant={'contained'}
                                loading={isUnpublishing}
                                onClick={handleUnpublishEngagement}
                            >
                                Submit
                            </PrimaryButton>
                        </Stack>
                    </Grid>
                </Grid>
            </Grid>
        </Modal>
    );
};

export default UnpublishModal;
