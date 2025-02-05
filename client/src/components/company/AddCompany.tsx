
import { addNewCompany } from '@/redux/company/companySlice';
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, TextField, Typography, debounce } from '@mui/material'
import React from 'react'
import parse from 'autosuggest-highlight/parse';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { toast } from 'react-toastify';

interface FormData {
    company_id: string;
    email: string,
    company_name: string,
    description: string,
    location: {
        city: string,
        cordinates: { 
            lat: string,
            lng: string
        }
  }
    user: {
        first_name: string,
        role: string
    }
}

const GOOGLE_MAPS_API_KEY = 'AIzaSyDgVjkwJxokry6jo1PFjv9qnGU8X7mjRGg';

function loadScript(src: string, position: HTMLElement | null, id: string) {
    if (!position) {
      return;
    }
  
    const script = document.createElement('script');
    script.setAttribute('async', '');
    script.setAttribute('id', id);
    script.src = src;
    position.appendChild(script);
  }
  
  const autocompleteService = { current: null };


  interface MainTextMatchedSubstrings {
    offset: number;
    length: number;
  }
  interface StructuredFormatting {
    main_text: string;
    secondary_text: string;
    main_text_matched_substrings?: readonly MainTextMatchedSubstrings[];
  }
  interface PlaceType {
    description: string;
    structured_formatting: StructuredFormatting;
  }
  

  
   const AddCompany = ({ open, handleClose }: { open: any, handleClose: any }) => {

    const [value, setValue] = React.useState<PlaceType | null>(null);
    const [inputValue, setInputValue] = React.useState('');
    const [options, setOptions] = React.useState<readonly PlaceType[]>([]);
    console.log(options,"options value")
    const loaded = React.useRef(false);
  
  
    if (typeof window !== 'undefined' && !loaded.current) {
      if (!document.querySelector('#google-maps')) {
        loadScript(
          `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`,
          document.querySelector('head'),
          'google-maps',
        );
      }
    
      loaded.current = true;
    }
    
  
    const fetch = React.useMemo(
      () =>
        debounce(
          (
            request: { input: string },
            callback: (results?: readonly PlaceType[]) => void,
          ) => {
            (autocompleteService.current as any).getPlacePredictions(
              request,
              callback,
            );
          },
          400,
        ),
      [],
    );
  
    
    React.useEffect(() => {
      let active = true;
  
      if (!autocompleteService.current && (window as any).google) {
        autocompleteService.current = new (
          window as any
        ).google.maps.places.AutocompleteService();
      }
      if (!autocompleteService.current) {
        return undefined;
      }
  
      if (inputValue === '') {
        setOptions(value ? [value] : []);
        return undefined;
      }
  
      fetch({ input: inputValue }, (results?: readonly PlaceType[]) => {
        if (active) {
          let newOptions: readonly PlaceType[] = [];
  
          if (value) {
            newOptions = [value];
          }
  
          if (results) {
            newOptions = [...newOptions, ...results];
          }
  
          setOptions(newOptions);
        }
      });
  
      return () => {
        active = false;
      };
    }, [value, inputValue, fetch]);
  
    const dispatch = useDispatch<any>();
    const { register, control, handleSubmit, reset, formState: { errors } } = useForm<FormData>();


    const handleSave = (formData: any) => {
        // Check if value is defined and has data
        if (value && value.structured_formatting) {

            const locationData = {
                city: value.description,
                cordinates: {
                    lat: value.structured_formatting.main_text,
                    lng: value.structured_formatting.secondary_text
                }
            };

    
            formData.location = locationData;
    
            
            dispatch(addNewCompany(formData));

        } else {
            // Handle the case where no location is selected
            console.error("No location selected!");
        }
    
        handleClose();
        toast.success('Company added successfully'); 

    };
    
    
    
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add Company</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Add New Comapny:
                </DialogContentText>
                <Grid xs={12}>
                  <Controller
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                          <TextField
                          {...register("company_name")}
                          error={!!errors.company_name}
                              placeholder="Company Name"
                              {...field}
                          />
                      )}
                      name="company_name"
                  /> 
                </Grid>
                <Grid xs={12} sx={{ padding: "10px 0px" }}>

                  <Controller
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <TextField   
                        {...register("email")}
                        error={!!errors.email}
                            placeholder="Contact Email"
                            {...field}                         
                        />
                    )}
                    name="email"
                  />
                </Grid>
                <Grid sx={{ padding: "10px 0px" }}>
                  <Controller                 
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <TextField
                        {...register("description")}
                        error={!!errors.description}
                            placeholder="Description"
                            {...field}
                        />
                    )}
                    name="description"
                  />
                </Grid>
                  <Autocomplete                    
                  {...register("location")}
                  
                  id="google-map-demo"
                  sx={{ width: 300 }}
                  getOptionLabel={(option) =>
                    typeof option === 'string' ? option : option.description
                  }
                  filterOptions={(x) => x}
                  options={options}
                  autoComplete
                  includeInputInList
                  filterSelectedOptions
                  value={value}
                  noOptionsText="No locations"
                  onChange={(event: any, newValue: PlaceType | null) => {
                    setOptions(newValue ? [newValue, ...options] : options);
                    setValue(newValue);
                  }}
                  onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Add a location" fullWidth />
                  )}
                  renderOption={(props, option) => {
                    const matches =
                      option.structured_formatting.main_text_matched_substrings || [];
            
                    const parts = parse(
                      option.structured_formatting.main_text,
                      matches.map((match: any) => [match.offset, match.offset + match.length]),
                    );
            
                    return (
                      <li {...props}>
                        <Grid container alignItems="center">
                          <Grid item sx={{ display: 'flex', width: 44 }}>
                            <LocationOnIcon sx={{ color: 'text.secondary' }} />
                          </Grid>
                          <Grid item sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                            {parts.map((part, index) => (
                              <Box
                                key={index}
                                component="span"
                                sx={{ fontWeight: part.highlight ? 'bold' : 'regular' }}
                              >
                                {part.text}
                              </Box>
                            ))}
                            <Typography variant="body2" color="text.secondary">
                              {option.structured_formatting.secondary_text}
                            </Typography>
                          </Grid>
                        </Grid>
                      </li>
                    );
                  }}
                />
                      
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit(handleSave)} >Save</Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddCompany