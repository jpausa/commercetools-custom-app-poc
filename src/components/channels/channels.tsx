import { useIntl } from 'react-intl';
import {
  Link as RouterLink,
  Switch,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import {
  usePaginationState,
  useDataTableSortingState,
} from '@commercetools-uikit/hooks';
import { BackIcon } from '@commercetools-uikit/icons';
import Constraints from '@commercetools-uikit/constraints';
import FlatButton from '@commercetools-uikit/flat-button';
import DataTable from '@commercetools-uikit/data-table';
import { ContentNotification } from '@commercetools-uikit/notifications';
import { Pagination } from '@commercetools-uikit/pagination';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { SuspendedRoute } from '@commercetools-frontend/application-shell';
import { formatLocalizedString } from '@commercetools-frontend/l10n';
import type { TFetchChannelsQuery } from '../../types/generated/ctp';
import messages from './messages';
import ChannelDetails from '../channel-details';
import { useEffect, useState } from 'react';
import { useAsyncDispatch, actions } from '@commercetools-frontend/sdk';
import { MC_API_PROXY_TARGETS } from '@commercetools-frontend/constants';

const columns = [
  { key: 'name', label: 'Channel name' },
  { key: 'key', label: 'Channel key', isSortable: true },
  { key: 'roles', label: 'Roles' },
];

type TChannelsProps = {
  linkToWelcome: string;
};

const Channels = (props: TChannelsProps) => {
  const intl = useIntl();
  const match = useRouteMatch();
  const { push } = useHistory();
  const { page, perPage } = usePaginationState();
  const tableSorting = useDataTableSortingState({ key: 'key', order: 'asc' });
  const { dataLocale, projectLanguages } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale,
    projectLanguages: context.project?.languages,
  }));

  const [channelsPaginatedResult, setChannelsPaginatedResult] = useState<
    TFetchChannelsQuery['channels'] | undefined
  >(undefined);
  const [error, setError] = useState<Error | null>(null);
  const dispatch = useAsyncDispatch();

  useEffect(() => {
    async function execute() {
      try {
        const result = (await dispatch(
          actions.get({
            mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
            service: 'channels',
            options: {},
          })
        )) as TFetchChannelsQuery['channels'];

        setChannelsPaginatedResult(result);
      } catch (error) {
        setError(error as Error);
      }
    }
    execute();
  }, [dispatch]);

  if (error) {
    return (
      <ContentNotification type="error">
        <Text.Body>{error.message}</Text.Body>
      </ContentNotification>
    );
  }

  return (
    <Spacings.Stack scale="xl">
      <Spacings.Stack scale="xs">
        <FlatButton
          as={RouterLink}
          to={props.linkToWelcome}
          label={intl.formatMessage(messages.backToWelcome)}
          icon={<BackIcon />}
        />
        <Text.Headline as="h2" intlMessage={messages.title} />
      </Spacings.Stack>

      <Constraints.Horizontal max={13}>
        <ContentNotification type="info">
          <Text.Body intlMessage={messages.demoHint} />
        </ContentNotification>
      </Constraints.Horizontal>

      {/* {loading && <LoadingSpinner />} */}

      {channelsPaginatedResult ? (
        <Spacings.Stack scale="l">
          <DataTable<NonNullable<TFetchChannelsQuery['channels']['results']>[0]>
            isCondensed
            columns={columns}
            rows={channelsPaginatedResult.results}
            itemRenderer={(item, column) => {
              switch (column.key) {
                case 'key':
                  return item.key;
                case 'roles':
                  return item.roles.join(', ');
                case 'name':
                  return formatLocalizedString(item, {
                    key: 'name',
                    locale: dataLocale,
                    fallbackOrder: projectLanguages,
                  });
                default:
                  return null;
              }
            }}
            sortedBy={tableSorting.value.key}
            sortDirection={tableSorting.value.order}
            onSortChange={tableSorting.onChange}
            onRowClick={(row) => push(`${match.url}/${row.id}`)}
          />
          <Pagination
            page={page.value}
            onPageChange={page.onChange}
            perPage={perPage.value}
            onPerPageChange={perPage.onChange}
            totalItems={channelsPaginatedResult.total}
          />
          <Switch>
            <SuspendedRoute path={`${match.url}/:id`}>
              <ChannelDetails onClose={() => push(`${match.url}`)} />
            </SuspendedRoute>
          </Switch>
        </Spacings.Stack>
      ) : null}
    </Spacings.Stack>
  );
};
Channels.displayName = 'Channels';

export default Channels;
