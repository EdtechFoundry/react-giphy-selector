import * as React from "react";
import * as cn from "classnames";

const defaultStyle = require("./QueryForm.css");

export interface IQueryFormProps {
  queryFormClassName?: string;
  queryFormInputClassName?: string;
  queryFormSubmitClassName?: string;
  queryFormStyle: object;
  queryFormWrapperStyle: object;
  queryFormInputStyle: object;
  queryFormSubmitStyle: object;
  queryFormSubmitContent: any;
  disableQueryFormButton?: boolean;
  onQueryChange: (q: string) => void;
  onQueryExecute: () => void;
  queryInputPlaceholder: string;
  queryValue: string;
}

export class QueryForm extends React.Component<IQueryFormProps, {}> {
  public static defaultProps: Partial<IQueryFormProps> = {
    queryFormStyle: {},
    queryFormWrapperStyle: {},
    queryFormInputStyle: {},
    queryFormSubmitStyle: {}
  };

  constructor(props: IQueryFormProps) {
    super(props);

    this.onValueChange = this.onValueChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  /**
   * Fires when the search input box has changed value
   * @param event
   */
  public onValueChange(event: any): void {
    this.props.onQueryChange(event.target.value || "");
  }

  /**
   * Fires when the form has been submitted (via "enter" or button)
   * @param event
   */
  public onSubmit(event: any): void {
    event.preventDefault();
    this.props.onQueryExecute();
  }

  public render(): JSX.Element {
    const {
      queryValue,
      queryInputPlaceholder,
      queryFormClassName,
      queryFormInputClassName,
      queryFormSubmitClassName,
      queryFormStyle,
      queryFormWrapperStyle,
      queryFormInputStyle,
      queryFormSubmitStyle,
      queryFormSubmitContent,
      disableQueryFormButton,
    } = this.props;

    return (
      <div style={queryFormWrapperStyle}>
        <form
          style={queryFormStyle}
          className={cn(defaultStyle.queryForm, queryFormClassName)}
          onSubmit={this.onSubmit}
        >
          <input
            style={queryFormInputStyle}
            className={cn(defaultStyle.queryFormInput, queryFormInputClassName)}
            value={queryValue}
            type="text"
            onChange={this.onValueChange}
            placeholder={queryInputPlaceholder}
          />
          {
            !disableQueryFormButton &&  (<button
              style={queryFormSubmitStyle}
              type="submit"
              className={cn(
                defaultStyle.queryFormSubmit,
                queryFormSubmitClassName
              )}
            >
              {queryFormSubmitContent}
            </button>)
          }
        </form>
      </div>
    );
  }
}
