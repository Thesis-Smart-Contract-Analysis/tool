import CircularProgress from '@mui/material/CircularProgress';

const Loading: React.FC<{
  size?: string;
  color?: string;
}> = ({ size = '4rem', color = '#00a4f4' }) => {
  return (
    <CircularProgress
      size={size}
      sx={{
        color,
      }}
    />
  );
};

export default Loading;
