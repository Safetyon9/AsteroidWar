import './WelcomePages.css';
import React, {useState} from "react";
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from "@mui/material/Select";


type SettingsPanelProps = {
  visible: boolean;
  onClose: () => void;
};

const SettingsPanel: React.FC<SettingsPanelProps> = ({ visible, onClose })=> {
    const [selected, setSelected] = useState<string[]>([]);
    const handleChange = (event: any) => {
        setSelected(event.target.value as string[]);
    }

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
                                    labelId="select-label"
                                    value={selected}
                                    onChange={handleChange}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: { backgroundColor: '#4e7ca0' }
                                        }
                                    }}
                                >
                                    <MenuItem sx={{color:'white'}} value="op1">keyboard</MenuItem>
                                    <MenuItem sx={{color:'white'}} value="op2">mouse</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                    <div className='settings-options'>
                        <p className='setting-name'>volume</p>
                        <div className='setting-change'>
                            <Slider sx={{color:'white'}} defaultValue={50} aria-label="Default" valueLabelDisplay="auto" />
                        </div>
                    </div>
                    <div className='settings-options'>
                        <p className='setting-name'>choose ship</p>
                        <div className='setting-change'>
                            <FormControl sx={{ width: '100%'}}>
                                <InputLabel sx={{ color: 'white'}} id="multi-select-label">Choose your ship</InputLabel>
                                <Select
                                    sx={{color:'white'}}
                                    labelId="select-label"
                                    value={selected}
                                    onChange={handleChange}
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
                                    labelId="select-label"
                                    value={selected}
                                    onChange={handleChange}
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
                                defaultChecked
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
                <button className='settings-btn' onClick={onClose}>
                    save
                </button>
            </div>
        </div>
    );
}

export default SettingsPanel;