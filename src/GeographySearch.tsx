import { FormControl, FormHelperText, FormLabel } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Select from "react-select";
import { useDebounce } from "./utils/hooks/useDebounce";
import { env } from "./utils/env";
import * as mbxClient from "@mapbox/mapbox-sdk";
import * as mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding";
const baseClient = mbxClient({
  accessToken: env.MAPBOX_PUBLIC_TOKEN,
});
const geocodingClient = mbxGeocoding(baseClient);
type MapboxSearchResult = {
  bbox: number[];
  center: number[];
  context: any;
  id: string;
  place_name: string;
  place_type: string[];
  properties: any;
  text: string;
  type: string;
};
export type Geography = {
  label?: string;
  value?: string;
  text?: string;
  center?: number[];
  bbox?: number[];
  context?: Geography[];
  placeType: string;
};
export type GeographyGroup = {
  label: string;
  options: Geography[];
};
// maxSelect - null or number - max number of geographies that can be selected (if relevant)
// searchAddress - boolean - whether or not to include addresses as options that can be selected
// searchNeighborhood - boolean - whether or not to include neighborhoods as options that can be selected
// searchPostcode - boolean - whether or not to include zipcodes as options that can be selected
// searchCounty - boolean - whether or not to include counties as options that can be selected
// searchState - boolean - whether or not to include states as options that can be selected
// searchCountry - boolean - whether or not to include nations as options that can be selected
// suggestionLimit - the max number of results to get from Mapbox. defaults to 5
// allowMultiple - true - multi select  - false - single select
// groupByType - boolean - whether to group search results by geography type (neighborhood, city, etc.)
// debounceMilliseconds - number - how long to wait before sending query to mapbox server - default 250 (ms)
type GeographySearchProps = {
  allowMultiple?: boolean;
  debounceMilliseconds?: number;
  groupByType?: boolean;
  helperText?: string;
  inputKey?: string;
  isLoading?: boolean;
  label: string;
  name: string;
  maxSelect?: number | null;
  onChange?: (values: Geography[], actionType: string) => void;
  options?: Geography[];
  placeholder?: string;
  searchAddress?: boolean;
  searchCity?: boolean;
  searchCountry?: boolean;
  searchCounty?: boolean;
  searchNeighborhood?: boolean;
  searchPostcode?: boolean;
  searchState?: boolean;
  searchTextValue?: string;
  selected?: Geography[];
  suggestionLimit?: number;
};
const GeographySearch: React.FC<GeographySearchProps> = ({
  allowMultiple = false,
  debounceMilliseconds = 250,
  groupByType = true,
  helperText,
  isLoading,
  label,
  maxSelect = null,
  name,
  options,
  onChange,
  placeholder,
  searchAddress = true,
  searchCity = true,
  searchCounty = true,
  searchCountry = false,
  searchNeighborhood = true,
  searchPostcode = true,
  searchState = true,
  searchTextValue,
  selected,
  suggestionLimit = 5,
}) => {
  const [searchText, setSearchText] = useState(
    searchTextValue ? searchTextValue : ""
  );
  const debouncedText = useDebounce(searchText, debounceMilliseconds);
  const [searchGeographies, setSearchGeographies] = useState<
    Geography[] | GeographyGroup[]
  >(options ? options : []);
  const [selectedGeographies, setSelectedGeographies] = useState<Geography[]>(
    selected ? selected : []
  );
  console.log("selectedGeographies", selectedGeographies);
  useEffect(() => {
    const callAsync = async () => {
      let geographyTypesSearch: string[] = [];
      if (searchAddress) {
        geographyTypesSearch.push("address");
      }
      if (searchCity) {
        geographyTypesSearch.push("place");
      }
      if (searchState) {
        geographyTypesSearch.push("region");
      }
      if (searchNeighborhood) {
        geographyTypesSearch.push("neighborhood");
      }
      if (searchPostcode) {
        geographyTypesSearch.push("postcode");
      }
      if (searchCountry) {
        geographyTypesSearch.push("country");
      }
      if (searchCounty) {
        geographyTypesSearch.push("district");
      }
      const countryLimits = ["us"];
      const geocodingResults = await geocodingClient
        .forwardGeocode({
          countries: countryLimits,
          query: debouncedText,
          limit: suggestionLimit,
          types: geographyTypesSearch,
          autocomplete: true,
        })
        .send();
      if (geocodingResults?.body?.features) {
        if (geocodingResults.body.features.length > 0) {
          let mapboxFeatures: MapboxSearchResult[] =
            geocodingResults.body.features;
          let newGeographies: Geography[] = [];
          let groupedGeographies: GeographyGroup[] = [];
          for (let mf = 0; mf < mapboxFeatures.length; mf++) {
            const mapboxFeature: MapboxSearchResult = mapboxFeatures[mf];
            let isRelevant = true;
            if (mapboxFeature?.properties?.accuracy) {
              const accuracy = mapboxFeature.properties.accuracy;
              if (accuracy === "street") {
                isRelevant = false;
              }
            }
            if (isRelevant) {
              let formattedLabel = mapboxFeature.place_name.replace(
                ", United States",
                ""
              );
              let formattedText = mapboxFeature.text;
              if (mapboxFeature.place_type.indexOf("address") >= 0) {
                const components = formattedLabel.split(", ");
                if (components.length >= 3) {
                  formattedText = `${components[0]}, ${components[1]}`;
                }
              }
              let formattedContext: any[] = [];
              if (
                Array.isArray(mapboxFeature.context) &&
                mapboxFeature.context.length > 0
              ) {
                const mfContext = mapboxFeature.context;
                for (let mf = 0; mf < mfContext.length; mf++) {
                  const item = mfContext[mf];
                  if (item.id && item.text) {
                    formattedContext.push({
                      value: mapboxFeature.context[mf].id,
                      text: mapboxFeature.context[mf].text,
                    });
                  }
                }
              }
              let formattedPlaceType: string = "";
              if (
                mapboxFeature.place_type &&
                Array.isArray(mapboxFeature.place_type) &&
                mapboxFeature.place_type.length > 0
              ) {
                formattedPlaceType = mapboxFeature.place_type[0];
                if (formattedPlaceType === "postcode") {
                  formattedPlaceType = "zipcode";
                } else if (formattedPlaceType === "district") {
                  formattedPlaceType = "county";
                } else if (formattedPlaceType === "region") {
                  formattedPlaceType = "state";
                } else if (formattedPlaceType === "neighborhood") {
                  formattedPlaceType = "neighborhood";
                } else if (formattedPlaceType === "address") {
                  formattedPlaceType = "address";
                } else if (formattedPlaceType === "country") {
                  formattedPlaceType = "country";
                } else if (formattedPlaceType === "place") {
                  formattedPlaceType = "city";
                }
              }
              if (groupByType) {
                let index = -1;
                for (let gg = 0; gg < groupedGeographies.length; gg++) {
                  if (groupedGeographies[gg].label === formattedPlaceType) {
                    index = gg;
                    break;
                  }
                }
                if (index >= 0) {
                  groupedGeographies[index].options.push({
                    label: formattedLabel,
                    value: mapboxFeature.id,
                    text: formattedText,
                    bbox: mapboxFeature.bbox,
                    center: mapboxFeature.center,
                    context: formattedContext,
                    placeType: formattedPlaceType,
                  });
                } else {
                  groupedGeographies.push({
                    label: formattedPlaceType,
                    options: [
                      {
                        label: formattedLabel,
                        value: mapboxFeature.id,
                        text: formattedText,
                        bbox: mapboxFeature.bbox,
                        center: mapboxFeature.center,
                        context: formattedContext,
                        placeType: formattedPlaceType,
                      },
                    ],
                  });
                }
              } else {
                newGeographies.push({
                  label: formattedLabel,
                  value: mapboxFeature.id,
                  text: formattedText,
                  bbox: mapboxFeature.bbox,
                  center: mapboxFeature.center,
                  context: formattedContext,
                  placeType: formattedPlaceType,
                });
              }
            }
          }
          if (groupByType) {
            setSearchGeographies(groupedGeographies);
          } else {
            setSearchGeographies(newGeographies);
          }
        }
      }
    };
    if (debouncedText) {
      callAsync();
    }
  }, [
    debouncedText,
    setSearchGeographies,
    suggestionLimit,
    searchAddress,
    searchNeighborhood,
    searchPostcode,
    searchCity,
    searchCountry,
    searchCounty,
    searchState,
    groupByType,
  ]);
  return (
    <FormControl>
      <FormLabel>{label && label}</FormLabel>
      <Select
        closeMenuOnSelect={allowMultiple ? false : true}
        closeMenuOnScroll={true}
        filterOption={({ label, value, data }) => true}
        isClearable
        isDisabled={isLoading}
        isLoading={isLoading}
        isMulti={allowMultiple}
        isSearchable={true}
        name={name}
        options={
          maxSelect
            ? selectedGeographies.length >= maxSelect
              ? []
              : searchGeographies
            : searchGeographies
        }
        noOptionsMessage={() => {
          return maxSelect
            ? selectedGeographies.length >= maxSelect
              ? `You can only select ${maxSelect} locations`
              : "Enter text to search for a location"
            : "Enter text to search for a location";
        }}
        placeholder={placeholder}
        value={selectedGeographies}
        formatOptionLabel={({ label, text }, { context }) => {
          if (context === "value") {
            return <div>{text}</div>;
          } else if (context === "menu") {
            return <div>{label}</div>;
          }
        }}
        onInputChange={(value: string) => {
          if (value && value.trim() !== "") {
            setSearchText(value);
          }
        }}
        onChange={(values: any, actionType: any) => {
          let newGeographies: Geography[] = [];
          if (allowMultiple) {
            newGeographies = [...values];
            if (onChange) {
              onChange(newGeographies, actionType);
            } else {
              setSelectedGeographies(newGeographies);
            }
          } else {
            if (values) {
              if (onChange) {
                onChange([values], actionType);
              } else {
                setSelectedGeographies([values]);
              }
            } else {
              if (onChange) {
                onChange(newGeographies, actionType);
              } else {
                setSelectedGeographies([]);
              }
            }
          }
        }}
      />
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
};
export default GeographySearch;
