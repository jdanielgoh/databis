/* global requestAnimationFrame, cancelAnimationFrame */
import React, {useEffect, useState} from 'react';
import { styled } from '@mui/system';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Slider from '@mui/material/Slider';
import Button from "@mui/material/Button";
import PlayIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

const PositionContainer = styled('div')({
  position: 'absolute',
  zIndex: 1,
  bottom: '40px',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
});

const COLOR = '#fff';


const SliderInput = styled(Slider)(({ theme }) => ({
  marginLeft: 12,
  width: '40%',
  color: COLOR,
  '& .MuiSlider-valueLabel': {
    whiteSpace: 'nowrap',
    background: 'none',
    color: COLOR,
  },
  transition: 'none', 
  '& .MuiSlider-thumb': {
    transition: 'none', 
  },
  '& .MuiSlider-track': {
    transition: 'none', 
  },
  '& .MuiSlider-rail': {
    transition: 'none', 
  },
}));

export default function RangeInput({min, max, value, animationSpeed, onChange, formatLabel}) {
  const [isPlaying, setIsPlaying] = useState(true);

  // prettier-ignore
  useEffect(() => {
    let animation;

    if (isPlaying) {
      animation = requestAnimationFrame(() => {
        let nextValue = value + animationSpeed;
        if (nextValue > max) {
          nextValue = min;
        }
        onChange(nextValue);
      });
    }

    return () => animation && cancelAnimationFrame(animation);
  });

  return (
    <PositionContainer style={{color: COLOR}}>
      <Button color="inherit" onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? <PauseIcon title="Stop" /> : <PlayIcon title="Animate" />}
      </Button>
      <SliderInput
        min={min}
        max={max}
        defaultValue={0}
        value={value}
        onChange={(event, newValue) => onChange(+newValue)}
        valueLabelDisplay="on"
        valueLabelFormat={formatLabel}
        disableSwap={true}
        
      />
    </PositionContainer>
  );
}
