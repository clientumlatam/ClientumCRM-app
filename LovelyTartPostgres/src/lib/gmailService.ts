export const getGmailMessages = async (accessToken: string, query: string = '') => {
  const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error('Failed to fetch Gmail messages');
  return res.json();
};

export const getGmailMessageDetails = async (accessToken: string, messageId: string) => {
  const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error('Failed to fetch Gmail message details');
  return res.json();
};

export const sendGmailMessage = async (accessToken: string, to: string, subject: string, body: string) => {
  const raw = [
    `To: ${to}`,
    `Subject: ${subject}`,
    'Content-Type: text/plain; charset="UTF-8"',
    '',
    body
  ].join('\r\n');
  
  const base64Encoded = btoa(raw).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  
  const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages/send`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ raw: base64Encoded }),
  });
  if (!res.ok) throw new Error('Failed to send Gmail message');
  return res.json();
};
