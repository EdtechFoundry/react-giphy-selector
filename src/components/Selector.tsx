import * as React from "react";
import * as cn from "classnames";

import { Rating, ResultSort, IGifObject } from "../types";
import { GiphyClient, ISearchResult } from "../lib/GiphyClient";
import { QueryForm } from "./QueryForm";
import { Suggestions } from "./Suggestions";
import { SearchResults } from "./SearchResults";
const defaultStyle = require("./Selector.css");
const attributionMark = require("../img/PoweredBy_200px-White_HorizText.png");

export interface ISelectorProps {
  // main props
  apiKey: string;
  rating?: Rating;
  sort?: ResultSort;
  limit?: number;
  suggestions?: string[];
  queryInputPlaceholder?: string;
  resultColumns?: number;
  onGifSelected: (gifObject: IGifObject) => void;
  showGiphyMark?: boolean;
  showTrendingInitially?: boolean;

  // query form style/content props
  queryFormClassName?: string;
  queryFormInputClassName?: string;
  queryFormSubmitClassName?: string;
  queryFormStyle?: object;
  queryFormWrapperStyle?: object;
  queryFormInputStyle?: object;
  queryFormSubmitStyle?: object;
  queryFormSubmitContent?: any;
  disableQueryFormButton?: boolean;

  // search results style
  searchResultsClassName?: string;
  searchResultsStyle?: object;
  searchResultsColumnStyle?: object;
  searchResultClassName?: string;
  searchResultStyle?: object;
  searchResultImgStyle?: object;

  // selector style
  selectorStyle?: object;

  suggestionsClassName?: string;
  suggestionsStyle?: object;
  suggestionClassName?: string;
  suggestionStyle?: object;

  // loader style/content props
  loaderClassName?: string;
  loaderStyle?: object;
  loaderContent?: any;

  // error style/content props
  searchErrorClassName?: string;
  searchErrorStyle?: object;

  // footer style props
  footerClassName?: string;
  footerStyle?: object;
}

export interface ISelectorState {
  query: string;
  isPending: boolean;
  searchError?: Error;
  searchResult?: ISearchResult;
}

export class Selector extends React.Component<ISelectorProps, ISelectorState> {
  public static defaultProps: Partial<ISelectorProps> = {
    rating: Rating.G,
    sort: ResultSort.Relevant,
    limit: 20,
    resultColumns: 3,
    showGiphyMark: true,
    queryInputPlaceholder: 'Enter search text',
    suggestions: [],
    loaderContent: "Loading...",
    loaderStyle: {},
    queryFormSubmitContent: "Search",
    footerStyle: {},
    searchErrorStyle: {},
    searchResultsStyle: {},
    searchResultsColumnStyle: {},
    searchResultStyle: {},
    searchResultImgStyle: {},
    selectorStyle: {},
    suggestionStyle: {},
    suggestionsStyle: {},
    showTrendingInitially: false,
  };

  public client: GiphyClient;

  constructor(props: ISelectorProps) {
    super(props);

    // Setup a new giphy client
    this.client = new GiphyClient(props.apiKey);

    // Set initial state
    this.state = {
      query: "",
      isPending: false,
      searchError: null,
      searchResult: null
    };

    this.onQueryChange = this.onQueryChange.bind(this);
    this.onQueryExecute = this.onQueryExecute.bind(this);
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
    this.getTrendingGifs = this.getTrendingGifs.bind(this);
  }

  componentDidMount () {
    if (this.props.showTrendingInitially) {
      this.getTrendingGifs();
    }
  }

  public getTrendingGifs(): void {
    const { rating, limit } = this.props;
    this.setState({
      isPending: true,
      searchError: null,
    });

    this.client.trendingGifs({
      rating,
      limit,
    })
    .then((result: ISearchResult) => {
      this.setState({
        isPending: false,
        searchResult: result
      });
    })
    .catch((err: Error) => {
      this.setState({
        isPending: false,
        searchError: err
      });
    });
  }

  /**
   * Fired when the query value changes for the
   * search
   * @param q string
   * @param cb func optional callback for when state is done updating
   */
  public onQueryChange(q: string, cb?: () => void): void {
    // Update the query
    this.setState({ query: q }, cb);
  }

  /**
   * Fired when the query should be executed
   */
  public onQueryExecute(): void {
    const { query } = this.state;
    const { rating, sort, limit } = this.props;

    this.setState({
      isPending: true,
      searchError: null
    });

    this.client
      .searchGifs({
        q: query,
        rating,
        limit,
        sort,
        offset: 0
      })
      .then((result: ISearchResult) => {
        this.setState({
          isPending: false,
          searchResult: result
        });
      })
      .catch((err: Error) => {
        this.setState({
          isPending: false,
          searchError: err
        });
      });
  }

  /**
   * Fired when a suggestion has been selected
   */
  public onSuggestionSelected(q: string): void {
    // Update query and wait for state change to finish
    // before executing query
    this.onQueryChange(q, () => {
      this.onQueryExecute();
    });
  }

  public render(): JSX.Element {
    const { query, searchResult, isPending, searchError } = this.state;
    const {
      suggestions,
      onGifSelected,
      queryInputPlaceholder,
      resultColumns,
      showGiphyMark,

      queryFormClassName,
      queryFormInputClassName,
      queryFormSubmitClassName,
      queryFormStyle,
      queryFormWrapperStyle,
      queryFormInputStyle,
      queryFormSubmitStyle,
      queryFormSubmitContent,
      disableQueryFormButton,

      searchResultClassName,
      searchResultStyle,
      searchResultsColumnStyle,
      searchResultsClassName,
      searchResultsStyle,
      searchResultImgStyle,

      selectorStyle,

      suggestionClassName,
      suggestionStyle,
      suggestionsClassName,
      suggestionsStyle,

      loaderClassName,
      loaderStyle,
      loaderContent,

      searchErrorClassName,
      searchErrorStyle,

      footerClassName,
      footerStyle
    } = this.props;

    const showSuggestions =
      !!suggestions.length && !searchResult && !isPending && !searchError;

    return (
      <div style={selectorStyle}>
        <QueryForm
          queryInputPlaceholder={queryInputPlaceholder}
          onQueryChange={this.onQueryChange}
          onQueryExecute={this.onQueryExecute}
          queryValue={query}
          queryFormClassName={queryFormClassName}
          queryFormInputClassName={queryFormInputClassName}
          queryFormSubmitClassName={queryFormSubmitClassName}
          queryFormStyle={queryFormStyle}
          queryFormWrapperStyle={queryFormWrapperStyle}
          queryFormInputStyle={queryFormInputStyle}
          queryFormSubmitStyle={queryFormSubmitStyle}
          queryFormSubmitContent={queryFormSubmitContent}
          disableQueryFormButton={disableQueryFormButton}
        />

        {showSuggestions && (
          <Suggestions
            suggestions={suggestions}
            onSuggestionSelected={this.onSuggestionSelected}
            suggestionClassName={suggestionClassName}
            suggestionStyle={suggestionStyle}
            suggestionsClassName={suggestionsClassName}
            suggestionsStyle={suggestionsStyle}
          />
        )}

        {isPending && (
          <div
            className={cn(defaultStyle.loader, loaderClassName)}
            style={loaderStyle}
          >
            {loaderContent}
          </div>
        )}

        {!isPending &&
          !!searchError && (
            <div
              className={cn(defaultStyle.searchError, searchErrorClassName)}
              style={searchErrorStyle}
            >
              {searchError.message}
            </div>
          )}

        {!isPending &&
          !!searchResult && (
            <SearchResults
              searchResultClassName={searchResultClassName}
              searchResultStyle={searchResultStyle}
              searchResultsColumnStyle={searchResultsColumnStyle}
              searchResultsClassName={searchResultsClassName}
              searchResultsStyle={searchResultsStyle}
              searchResultImgStyle={searchResultImgStyle}
              columns={resultColumns}
              gifObjects={searchResult.gifObjects}
              onGifSelected={onGifSelected}
            />
          )}
        <footer
          className={cn(defaultStyle.footer, footerClassName)}
          style={footerStyle}
        >
          {showGiphyMark && (
            <img
              className={defaultStyle.attributionMark}
              src={attributionMark}
            />
          )}
        </footer>
      </div>
    );
  }
}
