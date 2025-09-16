import './WelcomePages.css';
import React, { useState, useEffect } from "react";
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from "@mui/material/Select";

import { DEFAULT_SETTINGS, type GameSettings, type SettingsPanelProps } from '../types/settingsType.ts';
import { saveSettings, loadSettings } from '../util/settingStorage.ts';

const SettingsPanel: React.FC<SettingsPanelProps> = ({ visible, onClose, bgMusicRef })=> {
    const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);

    useEffect(() => {
        const saved = loadSettings();
        if (saved) setSettings(saved);
    }, []);

    if(!visible) return null;

    return (
        <div
            className='overlay-welcome'
        >
            <div
                className="settings-panel"
                onClick={e => e.stopPropagation()}
            >
                <h1 className='benvenuto'>Settings</h1>
                <div className='settings-grid'>
                    <div className='settings-options'>
                        <p className='setting-name'>controls</p>
                        <div className='setting-change'>
                            <FormControl sx={{ width: '100%'}}>
                                <InputLabel sx={{ color: 'white'}} id="multi-select-label">Choose your controls</InputLabel>
                                <Select
                                    sx={{color:'white'}}
                                    labelId="controls-label"
                                    value={settings.controls}
                                    onChange={(e) => setSettings(prev => ({...prev, controls: e.target.value as GameSettings["controls"]}))}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: { backgroundColor: '#4e7ca0' }
                                        }
                                    }}
                                >
                                    <MenuItem sx={{color:'white'}} value="op1">keyboard</MenuItem>
                                    <MenuItem sx={{color:'white'}} value="op2">mouse</MenuItem>
                                    <MenuItem sx={{color:'white'}} value="op3">mobile</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                    <div className='settings-options'>
                        <p className='setting-name'>volume</p>
                        <div className='setting-change'>
                            <Slider
                                sx={{color:'white'}}
                                value={settings.volume}
                                onChange={(_, val) => {
                                    const v = val as number;
                                    setSettings(prev => ({...prev, volume: v}));
                                    bgMusicRef.current?.setCustomVolume(v);
                                }}
                                min={0}
                                max={0.1}
                                step={0.01}
                                aria-label="Volume" valueLabelDisplay="auto" />
                        </div>
                    </div>
                    <div className='settings-options'>
                        <p className='setting-name'>choose ship</p>
                        <div className='setting-change'>
                            <FormControl sx={{ width: '100%'}}>
                                <InputLabel sx={{ color: 'white'}} id="multi-select-label">Choose your ship</InputLabel>
                                <Select
                                    sx={{color:'white'}}
                                    labelId="ship-label"
                                    value={settings.ship}
                                    onChange={(e) => setSettings(prev => ({...prev, ship: e.target.value as GameSettings["ship"]}))}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: { backgroundColor: '#4e7ca0' }
                                        }
                                    }}
                                >
                                    <MenuItem sx={{color:'white'}} value="op1">Eagle</MenuItem>
                                    <MenuItem sx={{color:'white'}} value="op2">Falcon</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                    <div className='settings-options'>
                        <p className='setting-name'>Language</p>
                        <div className='setting-change'>
                            <FormControl sx={{ width: '100%'}}>
                                <InputLabel sx={{ color: 'white'}} id="multi-select-label">Choose your language</InputLabel>
                                <Select
                                    sx={{color:'white'}}
                                    labelId="language-label"
                                    value={settings.language}
                                    onChange={(e) => setSettings(prev => ({...prev, language: e.target.value as GameSettings["language"]}))}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: { backgroundColor: '#4e7ca0' }
                                        }
                                    }}
                                >
                                    <MenuItem sx={{color:'white'}} value="op1">English</MenuItem>
                                    <MenuItem sx={{color:'white'}} value="op2">Italian</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                    <div className='settings-options'>
                        <p className='setting-name'>Subtitles</p>
                        <div className='setting-change'>
                            <Switch
                                checked={settings.subtitles}
                                onChange={(e) => setSettings(prev => ({...prev, subtitles: e.target.checked}))}
                                sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                        color: '#ffcc80',
                                    },
                                    '& .MuiSwitch-switchBase.Mui-checked:hover': {
                                        backgroundColor: 'rgba(255,165,0,0.2)',
                                    },
                                    '& .Mui-checked + .MuiSwitch-track': {
                                        backgroundColor: '#ffffff',
                                        opacity: 1,
                                    },
                                    '& .MuiSwitch-track': {
                                        backgroundColor: '#555',
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>
                <button 
                    className='settings-btn'
                    onClick={() => {
                        saveSettings(settings);
                        onClose();
                    }}
                >
                    save
                </button>
            </div>
        </div>
    );
}

export default SettingsPanel;