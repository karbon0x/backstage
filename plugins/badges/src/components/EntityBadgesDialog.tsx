/*
 * Copyright 2021 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Entity } from '@backstage/catalog-model';
import {
  CodeSnippet,
  Progress,
  ResponseErrorPanel,
  useApi,
} from '@backstage/core';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import React from 'react';
import { useAsync } from 'react-use';
import { badgesApiRef } from '../api';

type Props = {
  open: boolean;
  onClose?: () => any;
  entity: Entity;
};

export const EntityBadgesDialog = ({ open, onClose, entity }: Props) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const badgesApi = useApi(badgesApiRef);

  const { value: badges, loading, error } = useAsync(async () => {
    if (open) {
      return await badgesApi.getEntityBadgeSpecs(entity);
    }

    return [];
  }, [badgesApi, entity, open]);

  const content = (badges || []).map(
    ({ badge: { description }, id, url, markdown }) => (
      <DialogContentText>
        <Box m={4} />
        <img alt={description || id} src={url} />
        <CodeSnippet language="markdown" text={markdown} showCopyCodeButton />
      </DialogContentText>
    ),
  );

  return (
    <Dialog fullScreen={fullScreen} open={open} onClose={onClose}>
      <DialogTitle>Entity Badges</DialogTitle>

      <DialogContent>
        <DialogContentText>
          Embed badges in other web sites that link back to this entity. Copy
          the relevant snippet of Markdown code to use the badge.
        </DialogContentText>
        {loading && <Progress />}
        {error && <ResponseErrorPanel error={error} />}
        {content}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
