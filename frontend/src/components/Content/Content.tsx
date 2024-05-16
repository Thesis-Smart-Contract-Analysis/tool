import React, { useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import { Editor } from '@monaco-editor/react';

import Container from '@mui/material/Container';
import CancelIcon from '@mui/icons-material/Cancel';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import BackupIcon from '@mui/icons-material/Backup';
import Stack from '@mui/material/Stack';

import './Content.scss';

const Content: React.FC = () => {
  const { t } = useTranslation();

  const [code, setCode] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (files.find((file) => file.name === acceptedFiles[0].name))
        alert('Trùng tên file');
      else setFiles((prev) => [...prev, ...acceptedFiles]);
    },
    [files]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  const handleDeleteFile = (file: File) => {
    setFiles((prev) => {
      return prev.filter((f) => f !== file);
    });
  };

  const handleChooseFile = async (file: File) => {
    const text = await file.text();
    setCode(text);
  };

  return (
    <Container>
      <Box
        className='content'
        id='scan-now'
      >
        <Typography className='content__title'>{t('content.title')}</Typography>
        <Box className='content__wrapper'>
          <Box className='content-upload-file__wrapper'>
            {/* <Box className='content-upload-file__btn'>
              <label
                htmlFor='upload-file'
                className='upload-file-btn'
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {t('content.browse-file')}
              </label>

              <ButtonBase
                className='clear-files-btn'
                onClick={() => setFiles([])}
              >
                {t('content.clear-files')}
              </ButtonBase>
            </Box> */}

            <Box
              component='div'
              className='content-upload-file__list'
              {...getRootProps()}
            >
              {files?.map((file) => {
                return (
                  <Box
                    key={file.size + file.name}
                    className='content-upload-file__item'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChooseFile(file);
                    }}
                  >
                    <Stack
                      className='title'
                      gap={1}
                    >
                      <Typography variant='body1'>{file.name}</Typography>
                      <Typography variant='body2'>
                        {Math.floor(file.size / 1000)} KB
                      </Typography>
                    </Stack>

                    <Box className='action'>
                      <CancelIcon
                        fontSize='large'
                        color='action'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFile(file);
                        }}
                      />
                    </Box>
                  </Box>
                );
              })}

              <Stack
                justifyContent={'center'}
                gap={1}
                alignItems={'center'}
                className='content-upload-file__dropzone'
              >
                <input
                  id='upload-file'
                  type='file'
                  {...getInputProps()}
                />

                <BackupIcon className='icon' />

                <Typography className='text'>{t('common.choose')}</Typography>

                <Typography className='text'>- {t('common.or')} -</Typography>

                <Typography className='text'>
                  {isDragActive
                    ? t('content.drop-file-content')
                    : t('content.drag-file-content')}
                </Typography>
              </Stack>
            </Box>
          </Box>
          <Box className='content-code-editor__wrapper'>
            <Editor
              value={code}
              onChange={(value) => setCode(value as string)}
              defaultLanguage='sol'
            />
          </Box>
        </Box>
        <Box className='content__control'>
          <ButtonBase>{t('content.scan-file')}</ButtonBase>
        </Box>
      </Box>
    </Container>
  );
};

export default Content;
