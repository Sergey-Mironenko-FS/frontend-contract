import React, { useState, useEffect } from 'react';
import { Form, Input, Grid, Button } from 'semantic-ui-react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { gapi } from 'gapi-script';

const CLIENT_ID = '793749792420-fta57nkl4n8sfjug4ocut8rq9h44a0d8.apps.googleusercontent.com';
const API_KEY = 'AIzaSyD6Q8UzifOoCVozMPXTaCA8ZCrD_GtucPw';
const SHEET_ID = '1C4Lc5oAiOdhVfBgGMUuSZLxzuyEjW9qOZRUDY3nvQwc';
const SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

export default function Main(props) {
  const [status, setStatus] = useState(null);
  const [formState, setFormState] = useState({ address: '' });
  const [accountInfo, setAccountInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (_, data) =>
    setFormState(prev => ({ ...prev, [data.state]: data.value }));

  const { address } = formState;

  const fetchAccountInfo = async () => {
    setLoading(true);
    setAccountInfo(null);
    setStatus(null);

    try {
      const provider = new WsProvider('wss://rpc.polkadot.io');
      const api = await ApiPromise.create({ provider });

      if (!address) {
        throw new Error('Введите адрес.');
      }

      const account = await api.query.system.account(address);

      if (!account || !account.data) {
        throw new Error('Не удалось получить данные о кошельке. Проверьте адрес.');
      }

      const { free, reserved, miscFrozen, feeFrozen } = account.data;

      setAccountInfo({
        free: free?.toHuman() || '0',
        reserved: reserved?.toHuman() || '0',
        miscFrozen: miscFrozen?.toHuman() || '0',
        feeFrozen: feeFrozen?.toHuman() || '0',
      });
      setStatus('Данные успешно получены.');

      await addToGoogleSheet(address, free);
    } catch (error) {
      setStatus(`Ошибка: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addToGoogleSheet = async (address, free) => {
    try {
      const authInstance = gapi.auth2.getAuthInstance();
      if (!authInstance.isSignedIn.get()) {
        await authInstance.signIn();
      }

      console.log('authInstance', authInstance);

      const values = [[address, free]];

      const request = {
        spreadsheetId: SHEET_ID,
        range: 'Sheet1!A:E',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values,
        },
      };

      await gapi.client.sheets.spreadsheets.values.append(request);
      setStatus('Данные добавлены в Google Sheets.');
    } catch (error) {
      setStatus(`Ошибка при добавлении в Google Sheets`);
    }
  };

  /*
  const unsubscribe = await api.query.system.events((events) => {
    events.forEach((record) => {
      const { event, phase } = record;
      const types = event.typeDef;

      if (event.section === 'balances' && event.method === 'Burned') {
        console.log(`Tokens burned: ${event.data.toString()}`);
      }
    });
  });
  */

  useEffect(() => {
    const initClient = async () => {
      try {
        await gapi.load('client:auth2', () => {
          gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            scope: SCOPE,
          });
        });
      } catch {
        console.log('init client error')
      }
    };
    initClient();
  }, []);

  return (
    <Grid.Column width={8}>
      <h1>Check balance (custom)</h1>
      <Form>
        <Form.Field>
          <Input
            fluid
            label=">"
            type="text"
            placeholder="address"
            value={address}
            state="address"
            onChange={onChange}
          />
        </Form.Field>

        <Button
          primary
          onClick={fetchAccountInfo}
          disabled={loading || !address}
        >
          {loading ? 'Loading...' : 'Get Info'}
        </Button>

        <div style={{ overflowWrap: 'break-word', marginTop: '1em' }}>
          {status && <p>{status}</p>}
          {accountInfo && (
            <div>
              <p>Free Balance: {accountInfo.free}</p>
              <p>Reserved Balance: {accountInfo.reserved}</p>
              <p>Misc Frozen: {accountInfo.miscFrozen}</p>
              <p>Fee Frozen: {accountInfo.feeFrozen}</p>
            </div>
          )}
        </div>
      </Form>
    </Grid.Column>
  );
}
