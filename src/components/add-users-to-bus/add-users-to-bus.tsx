/* eslint-disable @typescript-eslint/no-unused-vars */
import { useIntl } from 'react-intl';
import FlatButton from '@commercetools-uikit/flat-button';
import { BackIcon } from '@commercetools-uikit/icons';
import Spacings from '@commercetools-uikit/spacings';
import DataTable from '@commercetools-uikit/data-table';
import { useAsyncDispatch, actions } from '@commercetools-frontend/sdk';
import { MC_API_PROXY_TARGETS } from '@commercetools-frontend/constants';
import { useState } from 'react';
import {
  Link as RouterLink,
  Switch,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';
import messages from '../channels/messages';
import { SuspendedRoute } from '@commercetools-frontend/application-shell';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import {
  usePaginationState,
  useDataTableSortingState,
} from '@commercetools-uikit/hooks';
import { Pagination } from '@commercetools-uikit/pagination';
import ChannelDetails from '../channel-details';

type AddUsersToBUsProps = {
  linkToWelcome: string;
};

const AddUsersToBUs = (props: AddUsersToBUsProps) => {
  const [processedData, setProcessedData] = useState<
    { id: string; sku: string; price: string }[]
  >([]);

  const intl = useIntl();
  const match = useRouteMatch();
  const { page, perPage } = usePaginationState();
  const tableSorting = useDataTableSortingState({ key: 'sku', order: 'asc' });
  useApplicationContext((context) => ({
    dataLocale: context.dataLocale,
    projectLanguages: context.project?.languages,
  }));
  const { push } = useHistory();

  const processFileContent = (content: string) => {
    const rows = content.split('\n');
    const data = rows.map((row, index) => {
      if (row.trim() === '' || row.includes('sku,price')) return null;
      const [sku, price] = row.split(',');
      return { id: index.toString(), sku, price };
    });
    setProcessedData(
      data.filter(
        (item): item is { id: string; sku: string; price: string } =>
          item !== null
      )
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        processFileContent(content);
      };
      reader.readAsText(file);
    }
  };

  const columns = [
    { key: 'sku', label: 'SKU' },
    { key: 'price', label: 'Price' },
  ];

  return (
    <Spacings.Stack scale="xl">
      <Spacings.Stack scale="xs">
        <FlatButton
          as={RouterLink}
          to={props.linkToWelcome}
          label={intl.formatMessage(messages.backToWelcome)}
          icon={<BackIcon />}
        />
      </Spacings.Stack>
      <div>
        <h2>Add users to BUs</h2>
        <form>
          <input type="file" accept=".csv" onChange={handleFileUpload} />
        </form>
      </div>

      {processedData.length > 0 ? (
        <Spacings.Stack scale="l">
          <DataTable<{ id: string; sku: string; price: string }>
            isCondensed
            columns={columns}
            rows={processedData}
            itemRenderer={(item, column) => {
              switch (column.key) {
                case 'sku':
                  return item.sku;
                case 'price':
                  return item.price;
                default:
                  return null;
              }
            }}
            sortedBy={tableSorting.value.key}
            sortDirection={tableSorting.value.order}
            onSortChange={tableSorting.onChange}
          />
          <Pagination
            page={page.value}
            onPageChange={page.onChange}
            perPage={perPage.value}
            onPerPageChange={perPage.onChange}
            totalItems={processedData.length}
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

export default AddUsersToBUs;
