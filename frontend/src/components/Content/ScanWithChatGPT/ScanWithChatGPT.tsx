import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import Markdown from 'react-markdown';

import chatgpt from '@/assets/chatgpt.png';
import Loading from '@/components/Loading/Loading';
import { BASE_URL } from '@/utils/constant';

import { Editor } from '@monaco-editor/react';
import LinearProgress from '@mui/material/LinearProgress';
import './ScanWithChatGPT.scss';

const ScanWithChatGPT: React.FC = () => {
  const { t } = useTranslation();

  const [severity, setSeverity] = useState('High');
  const [data, setData] = useState('');
  const [src, setSrc] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const element = document.getElementById('chatgpt-response');
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }, [data]);

  const handleScanWithChatGPT = async () => {
    try {
      setData('');
      setIsLoading(true);

      const response = await fetch(
        `${BASE_URL}/answer?string=${encodeURIComponent(src)}&severity=${severity}`,
      );
      const reader = response.body?.getReader();

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader!.read();
        if (done) {
          break;
        }
        setData((prevData) => prevData + new TextDecoder().decode(value));
      }

      setIsLoading(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.getElementById('chatgpt')?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, []);

  return (
    <Box id='chatgpt' className='chatgpt'>
      <Box className='chatgpt-container'>
        <Box className='chatgpt-container__title'>
          <Typography>{t('content.chatgpt.scan')}</Typography>
        </Box>
        <Box className='chatgpt-container__response'>
          <Box id='chatgpt-response' className='chatgpt-response__md'>
            <Markdown>
              {data || 'Kết quả phản hồi sẽ được hiển thị ở đây'}
            </Markdown>
            {isLoading ? <LinearProgress color='success' /> : null}
          </Box>
        </Box>

        <Box className='chatgpt-container__tool'>
          <img src={chatgpt} alt='' className='chatgpt-tool__logo' />

          <Box className='chatgpt-tool__wrapper'>
            <Box className='chatgpt-tool__editor'>
              <Box className='chatgpt-editor__title'>
                <Typography>{'Mã nguồn hợp đồng thông minh'}</Typography>
              </Box>

              <Box className='chatgpt-editor__editor'>
                <Editor
                  value={src}
                  language='sol'
                  onChange={(value) => {
                    setSrc(value as string);
                  }}
                />
              </Box>
            </Box>

            <Box className='chatgpt-tool__severity'>
              <Box className='chatgpt-severity__title'>
                <Typography>{t('content.chatgpt.select-severity')}</Typography>
              </Box>

              <Select
                defaultValue={'High'}
                className='chatgpt-severity__selection'
                onChange={(e) => {
                  setSeverity(e.target.value);
                }}
              >
                <MenuItem value={'High'}>High</MenuItem>
                <MenuItem value={'Medium'}>Medium</MenuItem>
                <MenuItem value={'Low'}>Low</MenuItem>
                <MenuItem value={'Informational'}>Informational</MenuItem>
              </Select>
            </Box>
          </Box>

          <ButtonBase
            onClick={handleScanWithChatGPT}
            className='chatgpt-tool__scan'
            disabled={src === ''}
          >
            {isLoading ? (
              <Loading color='white' size='3.2rem' />
            ) : (
              t('content.upload.scan')
            )}
          </ButtonBase>
        </Box>
      </Box>
    </Box>
  );
};

export default ScanWithChatGPT;
