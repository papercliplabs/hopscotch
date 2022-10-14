import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  timestamp: any;
  timestamptz: any;
  uuid: any;
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Int']>;
  _gt?: InputMaybe<Scalars['Int']>;
  _gte?: InputMaybe<Scalars['Int']>;
  _in?: InputMaybe<Array<Scalars['Int']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['Int']>;
  _lte?: InputMaybe<Scalars['Int']>;
  _neq?: InputMaybe<Scalars['Int']>;
  _nin?: InputMaybe<Array<Scalars['Int']>>;
};

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** delete data from the table: "request" */
  delete_request?: Maybe<Request_Mutation_Response>;
  /** delete single row from the table: "request" */
  delete_request_by_pk?: Maybe<Request>;
  /** delete data from the table: "request_status" */
  delete_request_status?: Maybe<Request_Status_Mutation_Response>;
  /** delete single row from the table: "request_status" */
  delete_request_status_by_pk?: Maybe<Request_Status>;
  /** delete data from the table: "user" */
  delete_user?: Maybe<User_Mutation_Response>;
  /** delete single row from the table: "user" */
  delete_user_by_pk?: Maybe<User>;
  /** insert data into the table: "request" */
  insert_request?: Maybe<Request_Mutation_Response>;
  /** insert a single row into the table: "request" */
  insert_request_one?: Maybe<Request>;
  /** insert data into the table: "request_status" */
  insert_request_status?: Maybe<Request_Status_Mutation_Response>;
  /** insert a single row into the table: "request_status" */
  insert_request_status_one?: Maybe<Request_Status>;
  /** insert data into the table: "user" */
  insert_user?: Maybe<User_Mutation_Response>;
  /** insert a single row into the table: "user" */
  insert_user_one?: Maybe<User>;
  /** execute VOLATILE function "refresh_nonce" which returns "user" */
  refresh_nonce: Array<User>;
  /** update data of the table: "request" */
  update_request?: Maybe<Request_Mutation_Response>;
  /** update single row of the table: "request" */
  update_request_by_pk?: Maybe<Request>;
  /** update data of the table: "request_status" */
  update_request_status?: Maybe<Request_Status_Mutation_Response>;
  /** update single row of the table: "request_status" */
  update_request_status_by_pk?: Maybe<Request_Status>;
  /** update data of the table: "user" */
  update_user?: Maybe<User_Mutation_Response>;
  /** update single row of the table: "user" */
  update_user_by_pk?: Maybe<User>;
  validate_signature?: Maybe<ValidateSignatureOutput>;
};


/** mutation root */
export type Mutation_RootDelete_RequestArgs = {
  where: Request_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Request_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Request_StatusArgs = {
  where: Request_Status_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Request_Status_By_PkArgs = {
  status: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_UserArgs = {
  where: User_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_User_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootInsert_RequestArgs = {
  objects: Array<Request_Insert_Input>;
  on_conflict?: InputMaybe<Request_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Request_OneArgs = {
  object: Request_Insert_Input;
  on_conflict?: InputMaybe<Request_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Request_StatusArgs = {
  objects: Array<Request_Status_Insert_Input>;
  on_conflict?: InputMaybe<Request_Status_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Request_Status_OneArgs = {
  object: Request_Status_Insert_Input;
  on_conflict?: InputMaybe<Request_Status_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_UserArgs = {
  objects: Array<User_Insert_Input>;
  on_conflict?: InputMaybe<User_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_User_OneArgs = {
  object: User_Insert_Input;
  on_conflict?: InputMaybe<User_On_Conflict>;
};


/** mutation root */
export type Mutation_RootRefresh_NonceArgs = {
  args: Refresh_Nonce_Args;
  distinct_on?: InputMaybe<Array<User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Order_By>>;
  where?: InputMaybe<User_Bool_Exp>;
};


/** mutation root */
export type Mutation_RootUpdate_RequestArgs = {
  _inc?: InputMaybe<Request_Inc_Input>;
  _set?: InputMaybe<Request_Set_Input>;
  where: Request_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Request_By_PkArgs = {
  _inc?: InputMaybe<Request_Inc_Input>;
  _set?: InputMaybe<Request_Set_Input>;
  pk_columns: Request_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Request_StatusArgs = {
  _set?: InputMaybe<Request_Status_Set_Input>;
  where: Request_Status_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Request_Status_By_PkArgs = {
  _set?: InputMaybe<Request_Status_Set_Input>;
  pk_columns: Request_Status_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_UserArgs = {
  _set?: InputMaybe<User_Set_Input>;
  where: User_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_User_By_PkArgs = {
  _set?: InputMaybe<User_Set_Input>;
  pk_columns: User_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootValidate_SignatureArgs = {
  args: ValidateSignatureInput;
};

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last'
}

export type Query_Root = {
  __typename?: 'query_root';
  /** fetch data from the table: "request" */
  request: Array<Request>;
  /** fetch aggregated fields from the table: "request" */
  request_aggregate: Request_Aggregate;
  /** fetch data from the table: "request" using primary key columns */
  request_by_pk?: Maybe<Request>;
  /** fetch data from the table: "request_status" */
  request_status: Array<Request_Status>;
  /** fetch aggregated fields from the table: "request_status" */
  request_status_aggregate: Request_Status_Aggregate;
  /** fetch data from the table: "request_status" using primary key columns */
  request_status_by_pk?: Maybe<Request_Status>;
  /** fetch data from the table: "user" */
  user: Array<User>;
  /** fetch aggregated fields from the table: "user" */
  user_aggregate: User_Aggregate;
  /** fetch data from the table: "user" using primary key columns */
  user_by_pk?: Maybe<User>;
};


export type Query_RootRequestArgs = {
  distinct_on?: InputMaybe<Array<Request_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Request_Order_By>>;
  where?: InputMaybe<Request_Bool_Exp>;
};


export type Query_RootRequest_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Request_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Request_Order_By>>;
  where?: InputMaybe<Request_Bool_Exp>;
};


export type Query_RootRequest_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootRequest_StatusArgs = {
  distinct_on?: InputMaybe<Array<Request_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Request_Status_Order_By>>;
  where?: InputMaybe<Request_Status_Bool_Exp>;
};


export type Query_RootRequest_Status_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Request_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Request_Status_Order_By>>;
  where?: InputMaybe<Request_Status_Bool_Exp>;
};


export type Query_RootRequest_Status_By_PkArgs = {
  status: Scalars['String'];
};


export type Query_RootUserArgs = {
  distinct_on?: InputMaybe<Array<User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Order_By>>;
  where?: InputMaybe<User_Bool_Exp>;
};


export type Query_RootUser_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Order_By>>;
  where?: InputMaybe<User_Bool_Exp>;
};


export type Query_RootUser_By_PkArgs = {
  id: Scalars['uuid'];
};

export type Refresh_Nonce_Args = {
  pkey?: InputMaybe<Scalars['String']>;
};

/** columns and relationships of "request" */
export type Request = {
  __typename?: 'request';
  chain_id: Scalars['Int'];
  id: Scalars['uuid'];
  /** An object relationship */
  owner: User;
  recipient_token_address: Scalars['String'];
  recipient_token_amount: Scalars['String'];
  status: Request_Status_Enum;
  transaction_hash?: Maybe<Scalars['String']>;
  user_id: Scalars['uuid'];
};

/** aggregated selection of "request" */
export type Request_Aggregate = {
  __typename?: 'request_aggregate';
  aggregate?: Maybe<Request_Aggregate_Fields>;
  nodes: Array<Request>;
};

/** aggregate fields of "request" */
export type Request_Aggregate_Fields = {
  __typename?: 'request_aggregate_fields';
  avg?: Maybe<Request_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Request_Max_Fields>;
  min?: Maybe<Request_Min_Fields>;
  stddev?: Maybe<Request_Stddev_Fields>;
  stddev_pop?: Maybe<Request_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Request_Stddev_Samp_Fields>;
  sum?: Maybe<Request_Sum_Fields>;
  var_pop?: Maybe<Request_Var_Pop_Fields>;
  var_samp?: Maybe<Request_Var_Samp_Fields>;
  variance?: Maybe<Request_Variance_Fields>;
};


/** aggregate fields of "request" */
export type Request_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Request_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "request" */
export type Request_Aggregate_Order_By = {
  avg?: InputMaybe<Request_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Request_Max_Order_By>;
  min?: InputMaybe<Request_Min_Order_By>;
  stddev?: InputMaybe<Request_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Request_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Request_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Request_Sum_Order_By>;
  var_pop?: InputMaybe<Request_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Request_Var_Samp_Order_By>;
  variance?: InputMaybe<Request_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "request" */
export type Request_Arr_Rel_Insert_Input = {
  data: Array<Request_Insert_Input>;
  /** on conflict condition */
  on_conflict?: InputMaybe<Request_On_Conflict>;
};

/** aggregate avg on columns */
export type Request_Avg_Fields = {
  __typename?: 'request_avg_fields';
  chain_id?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "request" */
export type Request_Avg_Order_By = {
  chain_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "request". All fields are combined with a logical 'AND'. */
export type Request_Bool_Exp = {
  _and?: InputMaybe<Array<Request_Bool_Exp>>;
  _not?: InputMaybe<Request_Bool_Exp>;
  _or?: InputMaybe<Array<Request_Bool_Exp>>;
  chain_id?: InputMaybe<Int_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  owner?: InputMaybe<User_Bool_Exp>;
  recipient_token_address?: InputMaybe<String_Comparison_Exp>;
  recipient_token_amount?: InputMaybe<String_Comparison_Exp>;
  status?: InputMaybe<Request_Status_Enum_Comparison_Exp>;
  transaction_hash?: InputMaybe<String_Comparison_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "request" */
export enum Request_Constraint {
  /** unique or primary key constraint */
  InvoicePkey = 'invoice_pkey'
}

/** input type for incrementing numeric columns in table "request" */
export type Request_Inc_Input = {
  chain_id?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "request" */
export type Request_Insert_Input = {
  chain_id?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['uuid']>;
  owner?: InputMaybe<User_Obj_Rel_Insert_Input>;
  recipient_token_address?: InputMaybe<Scalars['String']>;
  recipient_token_amount?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Request_Status_Enum>;
  transaction_hash?: InputMaybe<Scalars['String']>;
  user_id?: InputMaybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Request_Max_Fields = {
  __typename?: 'request_max_fields';
  chain_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['uuid']>;
  recipient_token_address?: Maybe<Scalars['String']>;
  recipient_token_amount?: Maybe<Scalars['String']>;
  transaction_hash?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "request" */
export type Request_Max_Order_By = {
  chain_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  recipient_token_address?: InputMaybe<Order_By>;
  recipient_token_amount?: InputMaybe<Order_By>;
  transaction_hash?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Request_Min_Fields = {
  __typename?: 'request_min_fields';
  chain_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['uuid']>;
  recipient_token_address?: Maybe<Scalars['String']>;
  recipient_token_amount?: Maybe<Scalars['String']>;
  transaction_hash?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "request" */
export type Request_Min_Order_By = {
  chain_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  recipient_token_address?: InputMaybe<Order_By>;
  recipient_token_amount?: InputMaybe<Order_By>;
  transaction_hash?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "request" */
export type Request_Mutation_Response = {
  __typename?: 'request_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Request>;
};

/** on conflict condition type for table "request" */
export type Request_On_Conflict = {
  constraint: Request_Constraint;
  update_columns?: Array<Request_Update_Column>;
  where?: InputMaybe<Request_Bool_Exp>;
};

/** Ordering options when selecting data from "request". */
export type Request_Order_By = {
  chain_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  owner?: InputMaybe<User_Order_By>;
  recipient_token_address?: InputMaybe<Order_By>;
  recipient_token_amount?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  transaction_hash?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: request */
export type Request_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "request" */
export enum Request_Select_Column {
  /** column name */
  ChainId = 'chain_id',
  /** column name */
  Id = 'id',
  /** column name */
  RecipientTokenAddress = 'recipient_token_address',
  /** column name */
  RecipientTokenAmount = 'recipient_token_amount',
  /** column name */
  Status = 'status',
  /** column name */
  TransactionHash = 'transaction_hash',
  /** column name */
  UserId = 'user_id'
}

/** input type for updating data in table "request" */
export type Request_Set_Input = {
  chain_id?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['uuid']>;
  recipient_token_address?: InputMaybe<Scalars['String']>;
  recipient_token_amount?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Request_Status_Enum>;
  transaction_hash?: InputMaybe<Scalars['String']>;
  user_id?: InputMaybe<Scalars['uuid']>;
};

/** columns and relationships of "request_status" */
export type Request_Status = {
  __typename?: 'request_status';
  status: Scalars['String'];
};

/** aggregated selection of "request_status" */
export type Request_Status_Aggregate = {
  __typename?: 'request_status_aggregate';
  aggregate?: Maybe<Request_Status_Aggregate_Fields>;
  nodes: Array<Request_Status>;
};

/** aggregate fields of "request_status" */
export type Request_Status_Aggregate_Fields = {
  __typename?: 'request_status_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Request_Status_Max_Fields>;
  min?: Maybe<Request_Status_Min_Fields>;
};


/** aggregate fields of "request_status" */
export type Request_Status_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Request_Status_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "request_status". All fields are combined with a logical 'AND'. */
export type Request_Status_Bool_Exp = {
  _and?: InputMaybe<Array<Request_Status_Bool_Exp>>;
  _not?: InputMaybe<Request_Status_Bool_Exp>;
  _or?: InputMaybe<Array<Request_Status_Bool_Exp>>;
  status?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "request_status" */
export enum Request_Status_Constraint {
  /** unique or primary key constraint */
  TransactionStatusPkey = 'transaction_status_pkey'
}

export enum Request_Status_Enum {
  Paid = 'PAID',
  TransactionPending = 'TRANSACTION_PENDING',
  Unpaid = 'UNPAID'
}

/** Boolean expression to compare columns of type "request_status_enum". All fields are combined with logical 'AND'. */
export type Request_Status_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Request_Status_Enum>;
  _in?: InputMaybe<Array<Request_Status_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Request_Status_Enum>;
  _nin?: InputMaybe<Array<Request_Status_Enum>>;
};

/** input type for inserting data into table "request_status" */
export type Request_Status_Insert_Input = {
  status?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Request_Status_Max_Fields = {
  __typename?: 'request_status_max_fields';
  status?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Request_Status_Min_Fields = {
  __typename?: 'request_status_min_fields';
  status?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "request_status" */
export type Request_Status_Mutation_Response = {
  __typename?: 'request_status_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Request_Status>;
};

/** on conflict condition type for table "request_status" */
export type Request_Status_On_Conflict = {
  constraint: Request_Status_Constraint;
  update_columns?: Array<Request_Status_Update_Column>;
  where?: InputMaybe<Request_Status_Bool_Exp>;
};

/** Ordering options when selecting data from "request_status". */
export type Request_Status_Order_By = {
  status?: InputMaybe<Order_By>;
};

/** primary key columns input for table: request_status */
export type Request_Status_Pk_Columns_Input = {
  status: Scalars['String'];
};

/** select columns of table "request_status" */
export enum Request_Status_Select_Column {
  /** column name */
  Status = 'status'
}

/** input type for updating data in table "request_status" */
export type Request_Status_Set_Input = {
  status?: InputMaybe<Scalars['String']>;
};

/** update columns of table "request_status" */
export enum Request_Status_Update_Column {
  /** column name */
  Status = 'status'
}

/** aggregate stddev on columns */
export type Request_Stddev_Fields = {
  __typename?: 'request_stddev_fields';
  chain_id?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "request" */
export type Request_Stddev_Order_By = {
  chain_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Request_Stddev_Pop_Fields = {
  __typename?: 'request_stddev_pop_fields';
  chain_id?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "request" */
export type Request_Stddev_Pop_Order_By = {
  chain_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Request_Stddev_Samp_Fields = {
  __typename?: 'request_stddev_samp_fields';
  chain_id?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "request" */
export type Request_Stddev_Samp_Order_By = {
  chain_id?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type Request_Sum_Fields = {
  __typename?: 'request_sum_fields';
  chain_id?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "request" */
export type Request_Sum_Order_By = {
  chain_id?: InputMaybe<Order_By>;
};

/** update columns of table "request" */
export enum Request_Update_Column {
  /** column name */
  ChainId = 'chain_id',
  /** column name */
  Id = 'id',
  /** column name */
  RecipientTokenAddress = 'recipient_token_address',
  /** column name */
  RecipientTokenAmount = 'recipient_token_amount',
  /** column name */
  Status = 'status',
  /** column name */
  TransactionHash = 'transaction_hash',
  /** column name */
  UserId = 'user_id'
}

/** aggregate var_pop on columns */
export type Request_Var_Pop_Fields = {
  __typename?: 'request_var_pop_fields';
  chain_id?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "request" */
export type Request_Var_Pop_Order_By = {
  chain_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Request_Var_Samp_Fields = {
  __typename?: 'request_var_samp_fields';
  chain_id?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "request" */
export type Request_Var_Samp_Order_By = {
  chain_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Request_Variance_Fields = {
  __typename?: 'request_variance_fields';
  chain_id?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "request" */
export type Request_Variance_Order_By = {
  chain_id?: InputMaybe<Order_By>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']>;
  _gt?: InputMaybe<Scalars['String']>;
  _gte?: InputMaybe<Scalars['String']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']>;
  _in?: InputMaybe<Array<Scalars['String']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']>;
  _lt?: InputMaybe<Scalars['String']>;
  _lte?: InputMaybe<Scalars['String']>;
  _neq?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']>;
  _nin?: InputMaybe<Array<Scalars['String']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']>;
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "request" */
  request: Array<Request>;
  /** fetch aggregated fields from the table: "request" */
  request_aggregate: Request_Aggregate;
  /** fetch data from the table: "request" using primary key columns */
  request_by_pk?: Maybe<Request>;
  /** fetch data from the table: "request_status" */
  request_status: Array<Request_Status>;
  /** fetch aggregated fields from the table: "request_status" */
  request_status_aggregate: Request_Status_Aggregate;
  /** fetch data from the table: "request_status" using primary key columns */
  request_status_by_pk?: Maybe<Request_Status>;
  /** fetch data from the table: "user" */
  user: Array<User>;
  /** fetch aggregated fields from the table: "user" */
  user_aggregate: User_Aggregate;
  /** fetch data from the table: "user" using primary key columns */
  user_by_pk?: Maybe<User>;
};


export type Subscription_RootRequestArgs = {
  distinct_on?: InputMaybe<Array<Request_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Request_Order_By>>;
  where?: InputMaybe<Request_Bool_Exp>;
};


export type Subscription_RootRequest_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Request_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Request_Order_By>>;
  where?: InputMaybe<Request_Bool_Exp>;
};


export type Subscription_RootRequest_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootRequest_StatusArgs = {
  distinct_on?: InputMaybe<Array<Request_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Request_Status_Order_By>>;
  where?: InputMaybe<Request_Status_Bool_Exp>;
};


export type Subscription_RootRequest_Status_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Request_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Request_Status_Order_By>>;
  where?: InputMaybe<Request_Status_Bool_Exp>;
};


export type Subscription_RootRequest_Status_By_PkArgs = {
  status: Scalars['String'];
};


export type Subscription_RootUserArgs = {
  distinct_on?: InputMaybe<Array<User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Order_By>>;
  where?: InputMaybe<User_Bool_Exp>;
};


export type Subscription_RootUser_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Order_By>>;
  where?: InputMaybe<User_Bool_Exp>;
};


export type Subscription_RootUser_By_PkArgs = {
  id: Scalars['uuid'];
};

/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
export type Timestamp_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamp']>;
  _gt?: InputMaybe<Scalars['timestamp']>;
  _gte?: InputMaybe<Scalars['timestamp']>;
  _in?: InputMaybe<Array<Scalars['timestamp']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['timestamp']>;
  _lte?: InputMaybe<Scalars['timestamp']>;
  _neq?: InputMaybe<Scalars['timestamp']>;
  _nin?: InputMaybe<Array<Scalars['timestamp']>>;
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamptz']>;
  _gt?: InputMaybe<Scalars['timestamptz']>;
  _gte?: InputMaybe<Scalars['timestamptz']>;
  _in?: InputMaybe<Array<Scalars['timestamptz']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['timestamptz']>;
  _lte?: InputMaybe<Scalars['timestamptz']>;
  _neq?: InputMaybe<Scalars['timestamptz']>;
  _nin?: InputMaybe<Array<Scalars['timestamptz']>>;
};

/** columns and relationships of "user" */
export type User = {
  __typename?: 'user';
  client_last_requested: Scalars['timestamp'];
  created_at?: Maybe<Scalars['timestamptz']>;
  id: Scalars['uuid'];
  nonce: Scalars['uuid'];
  public_key: Scalars['String'];
  /** An array relationship */
  requests: Array<Request>;
  /** An aggregate relationship */
  requests_aggregate: Request_Aggregate;
  updated_at?: Maybe<Scalars['timestamptz']>;
};


/** columns and relationships of "user" */
export type UserRequestsArgs = {
  distinct_on?: InputMaybe<Array<Request_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Request_Order_By>>;
  where?: InputMaybe<Request_Bool_Exp>;
};


/** columns and relationships of "user" */
export type UserRequests_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Request_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Request_Order_By>>;
  where?: InputMaybe<Request_Bool_Exp>;
};

/** aggregated selection of "user" */
export type User_Aggregate = {
  __typename?: 'user_aggregate';
  aggregate?: Maybe<User_Aggregate_Fields>;
  nodes: Array<User>;
};

/** aggregate fields of "user" */
export type User_Aggregate_Fields = {
  __typename?: 'user_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<User_Max_Fields>;
  min?: Maybe<User_Min_Fields>;
};


/** aggregate fields of "user" */
export type User_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<User_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "user". All fields are combined with a logical 'AND'. */
export type User_Bool_Exp = {
  _and?: InputMaybe<Array<User_Bool_Exp>>;
  _not?: InputMaybe<User_Bool_Exp>;
  _or?: InputMaybe<Array<User_Bool_Exp>>;
  client_last_requested?: InputMaybe<Timestamp_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  nonce?: InputMaybe<Uuid_Comparison_Exp>;
  public_key?: InputMaybe<String_Comparison_Exp>;
  requests?: InputMaybe<Request_Bool_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "user" */
export enum User_Constraint {
  /** unique or primary key constraint */
  UserPkey = 'user_pkey',
  /** unique or primary key constraint */
  UserPublicKeyKey = 'user_public_key_key'
}

/** input type for inserting data into table "user" */
export type User_Insert_Input = {
  client_last_requested?: InputMaybe<Scalars['timestamp']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  nonce?: InputMaybe<Scalars['uuid']>;
  public_key?: InputMaybe<Scalars['String']>;
  requests?: InputMaybe<Request_Arr_Rel_Insert_Input>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type User_Max_Fields = {
  __typename?: 'user_max_fields';
  client_last_requested?: Maybe<Scalars['timestamp']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  nonce?: Maybe<Scalars['uuid']>;
  public_key?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type User_Min_Fields = {
  __typename?: 'user_min_fields';
  client_last_requested?: Maybe<Scalars['timestamp']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  nonce?: Maybe<Scalars['uuid']>;
  public_key?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** response of any mutation on the table "user" */
export type User_Mutation_Response = {
  __typename?: 'user_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<User>;
};

/** input type for inserting object relation for remote table "user" */
export type User_Obj_Rel_Insert_Input = {
  data: User_Insert_Input;
  /** on conflict condition */
  on_conflict?: InputMaybe<User_On_Conflict>;
};

/** on conflict condition type for table "user" */
export type User_On_Conflict = {
  constraint: User_Constraint;
  update_columns?: Array<User_Update_Column>;
  where?: InputMaybe<User_Bool_Exp>;
};

/** Ordering options when selecting data from "user". */
export type User_Order_By = {
  client_last_requested?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  nonce?: InputMaybe<Order_By>;
  public_key?: InputMaybe<Order_By>;
  requests_aggregate?: InputMaybe<Request_Aggregate_Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: user */
export type User_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "user" */
export enum User_Select_Column {
  /** column name */
  ClientLastRequested = 'client_last_requested',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Nonce = 'nonce',
  /** column name */
  PublicKey = 'public_key',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "user" */
export type User_Set_Input = {
  client_last_requested?: InputMaybe<Scalars['timestamp']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  nonce?: InputMaybe<Scalars['uuid']>;
  public_key?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "user" */
export enum User_Update_Column {
  /** column name */
  ClientLastRequested = 'client_last_requested',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Nonce = 'nonce',
  /** column name */
  PublicKey = 'public_key',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['uuid']>;
  _gt?: InputMaybe<Scalars['uuid']>;
  _gte?: InputMaybe<Scalars['uuid']>;
  _in?: InputMaybe<Array<Scalars['uuid']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['uuid']>;
  _lte?: InputMaybe<Scalars['uuid']>;
  _neq?: InputMaybe<Scalars['uuid']>;
  _nin?: InputMaybe<Array<Scalars['uuid']>>;
};

export type ValidateSignatureInput = {
  public_address: Scalars['String'];
  signature: Scalars['String'];
};

export type ValidateSignatureOutput = {
  __typename?: 'ValidateSignatureOutput';
  accessToken: Scalars['String'];
};

export type InsertRequestMutationVariables = Exact<{
  object: Request_Insert_Input;
}>;


export type InsertRequestMutation = { __typename?: 'mutation_root', insert_request_one?: { __typename?: 'request', id: any } | null };

export type RefreshNonceMutationVariables = Exact<{
  publicKey: Scalars['String'];
}>;


export type RefreshNonceMutation = { __typename?: 'mutation_root', refresh_nonce: Array<{ __typename?: 'user', id: any, nonce: any, public_key: string }> };

export type UpdateRequestStatusMutationVariables = Exact<{
  id: Scalars['uuid'];
  transactionHash: Scalars['String'];
  status: Request_Status_Enum;
}>;


export type UpdateRequestStatusMutation = { __typename?: 'mutation_root', update_request_by_pk?: { __typename?: 'request', id: any, transaction_hash?: string | null, status: Request_Status_Enum } | null };

export type UpsertPublicUserMutationVariables = Exact<{
  publicKey: Scalars['String'];
}>;


export type UpsertPublicUserMutation = { __typename?: 'mutation_root', insert_user_one?: { __typename?: 'user', id: any, public_key: string, nonce: any, client_last_requested: any } | null };

export type ValidateSignatureMutationVariables = Exact<{
  publicKey: Scalars['String'];
  signature: Scalars['String'];
}>;


export type ValidateSignatureMutation = { __typename?: 'mutation_root', validate_signature?: { __typename?: 'ValidateSignatureOutput', accessToken: string } | null };

export type GetRequestQueryVariables = Exact<{
  id: Scalars['uuid'];
}>;


export type GetRequestQuery = { __typename?: 'query_root', request_by_pk?: { __typename?: 'request', id: any, recipient_token_amount: string, chain_id: number, status: Request_Status_Enum, recipient_token_address: string, transaction_hash?: string | null, user_id: any, owner: { __typename?: 'user', public_key: string } } | null };

export type GetUserByPublicKeyQueryVariables = Exact<{
  publicKey: Scalars['String'];
}>;


export type GetUserByPublicKeyQuery = { __typename?: 'query_root', user: Array<{ __typename?: 'user', id: any, public_key: string, nonce: any }> };

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { __typename?: 'query_root', user: Array<{ __typename?: 'user', id: any, public_key: string }> };


export const InsertRequestDocument = gql`
    mutation insertRequest($object: request_insert_input!) {
  insert_request_one(object: $object) {
    id
  }
}
    `;
export type InsertRequestMutationFn = Apollo.MutationFunction<InsertRequestMutation, InsertRequestMutationVariables>;

/**
 * __useInsertRequestMutation__
 *
 * To run a mutation, you first call `useInsertRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInsertRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [insertRequestMutation, { data, loading, error }] = useInsertRequestMutation({
 *   variables: {
 *      object: // value for 'object'
 *   },
 * });
 */
export function useInsertRequestMutation(baseOptions?: Apollo.MutationHookOptions<InsertRequestMutation, InsertRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InsertRequestMutation, InsertRequestMutationVariables>(InsertRequestDocument, options);
      }
export type InsertRequestMutationHookResult = ReturnType<typeof useInsertRequestMutation>;
export type InsertRequestMutationResult = Apollo.MutationResult<InsertRequestMutation>;
export type InsertRequestMutationOptions = Apollo.BaseMutationOptions<InsertRequestMutation, InsertRequestMutationVariables>;
export const RefreshNonceDocument = gql`
    mutation refreshNonce($publicKey: String!) {
  refresh_nonce(args: {pkey: $publicKey}) {
    id
    nonce
    public_key
  }
}
    `;
export type RefreshNonceMutationFn = Apollo.MutationFunction<RefreshNonceMutation, RefreshNonceMutationVariables>;

/**
 * __useRefreshNonceMutation__
 *
 * To run a mutation, you first call `useRefreshNonceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRefreshNonceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [refreshNonceMutation, { data, loading, error }] = useRefreshNonceMutation({
 *   variables: {
 *      publicKey: // value for 'publicKey'
 *   },
 * });
 */
export function useRefreshNonceMutation(baseOptions?: Apollo.MutationHookOptions<RefreshNonceMutation, RefreshNonceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RefreshNonceMutation, RefreshNonceMutationVariables>(RefreshNonceDocument, options);
      }
export type RefreshNonceMutationHookResult = ReturnType<typeof useRefreshNonceMutation>;
export type RefreshNonceMutationResult = Apollo.MutationResult<RefreshNonceMutation>;
export type RefreshNonceMutationOptions = Apollo.BaseMutationOptions<RefreshNonceMutation, RefreshNonceMutationVariables>;
export const UpdateRequestStatusDocument = gql`
    mutation updateRequestStatus($id: uuid!, $transactionHash: String!, $status: request_status_enum!) {
  update_request_by_pk(pk_columns: {id: $id}, _set: {status: $status, transaction_hash: $transactionHash}) {
    id
    transaction_hash
    status
  }
}
    `;
export type UpdateRequestStatusMutationFn = Apollo.MutationFunction<UpdateRequestStatusMutation, UpdateRequestStatusMutationVariables>;

/**
 * __useUpdateRequestStatusMutation__
 *
 * To run a mutation, you first call `useUpdateRequestStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRequestStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRequestStatusMutation, { data, loading, error }] = useUpdateRequestStatusMutation({
 *   variables: {
 *      id: // value for 'id'
 *      transactionHash: // value for 'transactionHash'
 *      status: // value for 'status'
 *   },
 * });
 */
export function useUpdateRequestStatusMutation(baseOptions?: Apollo.MutationHookOptions<UpdateRequestStatusMutation, UpdateRequestStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateRequestStatusMutation, UpdateRequestStatusMutationVariables>(UpdateRequestStatusDocument, options);
      }
export type UpdateRequestStatusMutationHookResult = ReturnType<typeof useUpdateRequestStatusMutation>;
export type UpdateRequestStatusMutationResult = Apollo.MutationResult<UpdateRequestStatusMutation>;
export type UpdateRequestStatusMutationOptions = Apollo.BaseMutationOptions<UpdateRequestStatusMutation, UpdateRequestStatusMutationVariables>;
export const UpsertPublicUserDocument = gql`
    mutation upsertPublicUser($publicKey: String!) {
  insert_user_one(object: {public_key: $publicKey}, on_conflict: {constraint: user_public_key_key, update_columns: [client_last_requested]}) {
    id
    public_key
    nonce
    client_last_requested
  }
}
    `;
export type UpsertPublicUserMutationFn = Apollo.MutationFunction<UpsertPublicUserMutation, UpsertPublicUserMutationVariables>;

/**
 * __useUpsertPublicUserMutation__
 *
 * To run a mutation, you first call `useUpsertPublicUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpsertPublicUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [upsertPublicUserMutation, { data, loading, error }] = useUpsertPublicUserMutation({
 *   variables: {
 *      publicKey: // value for 'publicKey'
 *   },
 * });
 */
export function useUpsertPublicUserMutation(baseOptions?: Apollo.MutationHookOptions<UpsertPublicUserMutation, UpsertPublicUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpsertPublicUserMutation, UpsertPublicUserMutationVariables>(UpsertPublicUserDocument, options);
      }
export type UpsertPublicUserMutationHookResult = ReturnType<typeof useUpsertPublicUserMutation>;
export type UpsertPublicUserMutationResult = Apollo.MutationResult<UpsertPublicUserMutation>;
export type UpsertPublicUserMutationOptions = Apollo.BaseMutationOptions<UpsertPublicUserMutation, UpsertPublicUserMutationVariables>;
export const ValidateSignatureDocument = gql`
    mutation validateSignature($publicKey: String!, $signature: String!) {
  validate_signature(args: {public_address: $publicKey, signature: $signature}) {
    accessToken
  }
}
    `;
export type ValidateSignatureMutationFn = Apollo.MutationFunction<ValidateSignatureMutation, ValidateSignatureMutationVariables>;

/**
 * __useValidateSignatureMutation__
 *
 * To run a mutation, you first call `useValidateSignatureMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useValidateSignatureMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [validateSignatureMutation, { data, loading, error }] = useValidateSignatureMutation({
 *   variables: {
 *      publicKey: // value for 'publicKey'
 *      signature: // value for 'signature'
 *   },
 * });
 */
export function useValidateSignatureMutation(baseOptions?: Apollo.MutationHookOptions<ValidateSignatureMutation, ValidateSignatureMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ValidateSignatureMutation, ValidateSignatureMutationVariables>(ValidateSignatureDocument, options);
      }
export type ValidateSignatureMutationHookResult = ReturnType<typeof useValidateSignatureMutation>;
export type ValidateSignatureMutationResult = Apollo.MutationResult<ValidateSignatureMutation>;
export type ValidateSignatureMutationOptions = Apollo.BaseMutationOptions<ValidateSignatureMutation, ValidateSignatureMutationVariables>;
export const GetRequestDocument = gql`
    query getRequest($id: uuid!) {
  request_by_pk(id: $id) {
    id
    recipient_token_amount
    chain_id
    status
    recipient_token_address
    transaction_hash
    user_id
    owner {
      public_key
    }
  }
}
    `;

/**
 * __useGetRequestQuery__
 *
 * To run a query within a React component, call `useGetRequestQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRequestQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRequestQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetRequestQuery(baseOptions: Apollo.QueryHookOptions<GetRequestQuery, GetRequestQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRequestQuery, GetRequestQueryVariables>(GetRequestDocument, options);
      }
export function useGetRequestLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRequestQuery, GetRequestQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRequestQuery, GetRequestQueryVariables>(GetRequestDocument, options);
        }
export type GetRequestQueryHookResult = ReturnType<typeof useGetRequestQuery>;
export type GetRequestLazyQueryHookResult = ReturnType<typeof useGetRequestLazyQuery>;
export type GetRequestQueryResult = Apollo.QueryResult<GetRequestQuery, GetRequestQueryVariables>;
export const GetUserByPublicKeyDocument = gql`
    query getUserByPublicKey($publicKey: String!) {
  user(limit: 1, where: {public_key: {_eq: $publicKey}}) {
    id
    public_key
    nonce
  }
}
    `;

/**
 * __useGetUserByPublicKeyQuery__
 *
 * To run a query within a React component, call `useGetUserByPublicKeyQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserByPublicKeyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserByPublicKeyQuery({
 *   variables: {
 *      publicKey: // value for 'publicKey'
 *   },
 * });
 */
export function useGetUserByPublicKeyQuery(baseOptions: Apollo.QueryHookOptions<GetUserByPublicKeyQuery, GetUserByPublicKeyQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserByPublicKeyQuery, GetUserByPublicKeyQueryVariables>(GetUserByPublicKeyDocument, options);
      }
export function useGetUserByPublicKeyLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserByPublicKeyQuery, GetUserByPublicKeyQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserByPublicKeyQuery, GetUserByPublicKeyQueryVariables>(GetUserByPublicKeyDocument, options);
        }
export type GetUserByPublicKeyQueryHookResult = ReturnType<typeof useGetUserByPublicKeyQuery>;
export type GetUserByPublicKeyLazyQueryHookResult = ReturnType<typeof useGetUserByPublicKeyLazyQuery>;
export type GetUserByPublicKeyQueryResult = Apollo.QueryResult<GetUserByPublicKeyQuery, GetUserByPublicKeyQueryVariables>;
export const GetUsersDocument = gql`
    query getUsers {
  user {
    id
    public_key
  }
}
    `;

/**
 * __useGetUsersQuery__
 *
 * To run a query within a React component, call `useGetUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUsersQuery(baseOptions?: Apollo.QueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
      }
export function useGetUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
        }
export type GetUsersQueryHookResult = ReturnType<typeof useGetUsersQuery>;
export type GetUsersLazyQueryHookResult = ReturnType<typeof useGetUsersLazyQuery>;
export type GetUsersQueryResult = Apollo.QueryResult<GetUsersQuery, GetUsersQueryVariables>;