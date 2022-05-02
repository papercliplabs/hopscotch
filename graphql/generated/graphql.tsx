import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  timestamptz: any;
  uuid: any;
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: Maybe<Scalars['Int']>;
  _gt?: Maybe<Scalars['Int']>;
  _gte?: Maybe<Scalars['Int']>;
  _in?: Maybe<Array<Scalars['Int']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['Int']>;
  _lte?: Maybe<Scalars['Int']>;
  _neq?: Maybe<Scalars['Int']>;
  _nin?: Maybe<Array<Scalars['Int']>>;
};

/** columns and relationships of "invoices" */
export type Invoices = {
  __typename?: 'invoices';
  chain_id: Scalars['Int'];
  id: Scalars['uuid'];
  recipient_id: Scalars['uuid'];
  recipient_token_address: Scalars['String'];
  recipient_token_amount_raw: Scalars['String'];
  /** An object relationship */
  recipient_user: Users;
  status: Scalars['String'];
  transaction_id?: Maybe<Scalars['String']>;
};

/** aggregated selection of "invoices" */
export type Invoices_Aggregate = {
  __typename?: 'invoices_aggregate';
  aggregate?: Maybe<Invoices_Aggregate_Fields>;
  nodes: Array<Invoices>;
};

/** aggregate fields of "invoices" */
export type Invoices_Aggregate_Fields = {
  __typename?: 'invoices_aggregate_fields';
  avg?: Maybe<Invoices_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Invoices_Max_Fields>;
  min?: Maybe<Invoices_Min_Fields>;
  stddev?: Maybe<Invoices_Stddev_Fields>;
  stddev_pop?: Maybe<Invoices_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Invoices_Stddev_Samp_Fields>;
  sum?: Maybe<Invoices_Sum_Fields>;
  var_pop?: Maybe<Invoices_Var_Pop_Fields>;
  var_samp?: Maybe<Invoices_Var_Samp_Fields>;
  variance?: Maybe<Invoices_Variance_Fields>;
};


/** aggregate fields of "invoices" */
export type Invoices_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Invoices_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "invoices" */
export type Invoices_Aggregate_Order_By = {
  avg?: Maybe<Invoices_Avg_Order_By>;
  count?: Maybe<Order_By>;
  max?: Maybe<Invoices_Max_Order_By>;
  min?: Maybe<Invoices_Min_Order_By>;
  stddev?: Maybe<Invoices_Stddev_Order_By>;
  stddev_pop?: Maybe<Invoices_Stddev_Pop_Order_By>;
  stddev_samp?: Maybe<Invoices_Stddev_Samp_Order_By>;
  sum?: Maybe<Invoices_Sum_Order_By>;
  var_pop?: Maybe<Invoices_Var_Pop_Order_By>;
  var_samp?: Maybe<Invoices_Var_Samp_Order_By>;
  variance?: Maybe<Invoices_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "invoices" */
export type Invoices_Arr_Rel_Insert_Input = {
  data: Array<Invoices_Insert_Input>;
  /** on conflict condition */
  on_conflict?: Maybe<Invoices_On_Conflict>;
};

/** aggregate avg on columns */
export type Invoices_Avg_Fields = {
  __typename?: 'invoices_avg_fields';
  chain_id?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "invoices" */
export type Invoices_Avg_Order_By = {
  chain_id?: Maybe<Order_By>;
};

/** Boolean expression to filter rows from the table "invoices". All fields are combined with a logical 'AND'. */
export type Invoices_Bool_Exp = {
  _and?: Maybe<Array<Invoices_Bool_Exp>>;
  _not?: Maybe<Invoices_Bool_Exp>;
  _or?: Maybe<Array<Invoices_Bool_Exp>>;
  chain_id?: Maybe<Int_Comparison_Exp>;
  id?: Maybe<Uuid_Comparison_Exp>;
  recipient_id?: Maybe<Uuid_Comparison_Exp>;
  recipient_token_address?: Maybe<String_Comparison_Exp>;
  recipient_token_amount_raw?: Maybe<String_Comparison_Exp>;
  recipient_user?: Maybe<Users_Bool_Exp>;
  status?: Maybe<String_Comparison_Exp>;
  transaction_id?: Maybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "invoices" */
export enum Invoices_Constraint {
  /** unique or primary key constraint */
  InvoicePkey = 'invoice_pkey'
}

/** input type for incrementing numeric columns in table "invoices" */
export type Invoices_Inc_Input = {
  chain_id?: Maybe<Scalars['Int']>;
};

/** input type for inserting data into table "invoices" */
export type Invoices_Insert_Input = {
  chain_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['uuid']>;
  recipient_id?: Maybe<Scalars['uuid']>;
  recipient_token_address?: Maybe<Scalars['String']>;
  recipient_token_amount_raw?: Maybe<Scalars['String']>;
  recipient_user?: Maybe<Users_Obj_Rel_Insert_Input>;
  status?: Maybe<Scalars['String']>;
  transaction_id?: Maybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Invoices_Max_Fields = {
  __typename?: 'invoices_max_fields';
  chain_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['uuid']>;
  recipient_id?: Maybe<Scalars['uuid']>;
  recipient_token_address?: Maybe<Scalars['String']>;
  recipient_token_amount_raw?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  transaction_id?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "invoices" */
export type Invoices_Max_Order_By = {
  chain_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  recipient_id?: Maybe<Order_By>;
  recipient_token_address?: Maybe<Order_By>;
  recipient_token_amount_raw?: Maybe<Order_By>;
  status?: Maybe<Order_By>;
  transaction_id?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Invoices_Min_Fields = {
  __typename?: 'invoices_min_fields';
  chain_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['uuid']>;
  recipient_id?: Maybe<Scalars['uuid']>;
  recipient_token_address?: Maybe<Scalars['String']>;
  recipient_token_amount_raw?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  transaction_id?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "invoices" */
export type Invoices_Min_Order_By = {
  chain_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  recipient_id?: Maybe<Order_By>;
  recipient_token_address?: Maybe<Order_By>;
  recipient_token_amount_raw?: Maybe<Order_By>;
  status?: Maybe<Order_By>;
  transaction_id?: Maybe<Order_By>;
};

/** response of any mutation on the table "invoices" */
export type Invoices_Mutation_Response = {
  __typename?: 'invoices_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Invoices>;
};

/** on conflict condition type for table "invoices" */
export type Invoices_On_Conflict = {
  constraint: Invoices_Constraint;
  update_columns?: Array<Invoices_Update_Column>;
  where?: Maybe<Invoices_Bool_Exp>;
};

/** Ordering options when selecting data from "invoices". */
export type Invoices_Order_By = {
  chain_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  recipient_id?: Maybe<Order_By>;
  recipient_token_address?: Maybe<Order_By>;
  recipient_token_amount_raw?: Maybe<Order_By>;
  recipient_user?: Maybe<Users_Order_By>;
  status?: Maybe<Order_By>;
  transaction_id?: Maybe<Order_By>;
};

/** primary key columns input for table: invoices */
export type Invoices_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "invoices" */
export enum Invoices_Select_Column {
  /** column name */
  ChainId = 'chain_id',
  /** column name */
  Id = 'id',
  /** column name */
  RecipientId = 'recipient_id',
  /** column name */
  RecipientTokenAddress = 'recipient_token_address',
  /** column name */
  RecipientTokenAmountRaw = 'recipient_token_amount_raw',
  /** column name */
  Status = 'status',
  /** column name */
  TransactionId = 'transaction_id'
}

/** input type for updating data in table "invoices" */
export type Invoices_Set_Input = {
  chain_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['uuid']>;
  recipient_id?: Maybe<Scalars['uuid']>;
  recipient_token_address?: Maybe<Scalars['String']>;
  recipient_token_amount_raw?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  transaction_id?: Maybe<Scalars['String']>;
};

/** aggregate stddev on columns */
export type Invoices_Stddev_Fields = {
  __typename?: 'invoices_stddev_fields';
  chain_id?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "invoices" */
export type Invoices_Stddev_Order_By = {
  chain_id?: Maybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Invoices_Stddev_Pop_Fields = {
  __typename?: 'invoices_stddev_pop_fields';
  chain_id?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "invoices" */
export type Invoices_Stddev_Pop_Order_By = {
  chain_id?: Maybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Invoices_Stddev_Samp_Fields = {
  __typename?: 'invoices_stddev_samp_fields';
  chain_id?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "invoices" */
export type Invoices_Stddev_Samp_Order_By = {
  chain_id?: Maybe<Order_By>;
};

/** aggregate sum on columns */
export type Invoices_Sum_Fields = {
  __typename?: 'invoices_sum_fields';
  chain_id?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "invoices" */
export type Invoices_Sum_Order_By = {
  chain_id?: Maybe<Order_By>;
};

/** update columns of table "invoices" */
export enum Invoices_Update_Column {
  /** column name */
  ChainId = 'chain_id',
  /** column name */
  Id = 'id',
  /** column name */
  RecipientId = 'recipient_id',
  /** column name */
  RecipientTokenAddress = 'recipient_token_address',
  /** column name */
  RecipientTokenAmountRaw = 'recipient_token_amount_raw',
  /** column name */
  Status = 'status',
  /** column name */
  TransactionId = 'transaction_id'
}

/** aggregate var_pop on columns */
export type Invoices_Var_Pop_Fields = {
  __typename?: 'invoices_var_pop_fields';
  chain_id?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "invoices" */
export type Invoices_Var_Pop_Order_By = {
  chain_id?: Maybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Invoices_Var_Samp_Fields = {
  __typename?: 'invoices_var_samp_fields';
  chain_id?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "invoices" */
export type Invoices_Var_Samp_Order_By = {
  chain_id?: Maybe<Order_By>;
};

/** aggregate variance on columns */
export type Invoices_Variance_Fields = {
  __typename?: 'invoices_variance_fields';
  chain_id?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "invoices" */
export type Invoices_Variance_Order_By = {
  chain_id?: Maybe<Order_By>;
};

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** delete data from the table: "invoices" */
  delete_invoices?: Maybe<Invoices_Mutation_Response>;
  /** delete single row from the table: "invoices" */
  delete_invoices_by_pk?: Maybe<Invoices>;
  /** delete data from the table: "users" */
  delete_users?: Maybe<Users_Mutation_Response>;
  /** delete single row from the table: "users" */
  delete_users_by_pk?: Maybe<Users>;
  /** insert data into the table: "invoices" */
  insert_invoices?: Maybe<Invoices_Mutation_Response>;
  /** insert a single row into the table: "invoices" */
  insert_invoices_one?: Maybe<Invoices>;
  /** insert data into the table: "users" */
  insert_users?: Maybe<Users_Mutation_Response>;
  /** insert a single row into the table: "users" */
  insert_users_one?: Maybe<Users>;
  /** update data of the table: "invoices" */
  update_invoices?: Maybe<Invoices_Mutation_Response>;
  /** update single row of the table: "invoices" */
  update_invoices_by_pk?: Maybe<Invoices>;
  /** update data of the table: "users" */
  update_users?: Maybe<Users_Mutation_Response>;
  /** update single row of the table: "users" */
  update_users_by_pk?: Maybe<Users>;
  validate_signature?: Maybe<ValidateSignatureOutput>;
};


/** mutation root */
export type Mutation_RootDelete_InvoicesArgs = {
  where: Invoices_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Invoices_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_UsersArgs = {
  where: Users_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Users_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootInsert_InvoicesArgs = {
  objects: Array<Invoices_Insert_Input>;
  on_conflict?: Maybe<Invoices_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Invoices_OneArgs = {
  object: Invoices_Insert_Input;
  on_conflict?: Maybe<Invoices_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_UsersArgs = {
  objects: Array<Users_Insert_Input>;
  on_conflict?: Maybe<Users_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Users_OneArgs = {
  object: Users_Insert_Input;
  on_conflict?: Maybe<Users_On_Conflict>;
};


/** mutation root */
export type Mutation_RootUpdate_InvoicesArgs = {
  _inc?: Maybe<Invoices_Inc_Input>;
  _set?: Maybe<Invoices_Set_Input>;
  where: Invoices_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Invoices_By_PkArgs = {
  _inc?: Maybe<Invoices_Inc_Input>;
  _set?: Maybe<Invoices_Set_Input>;
  pk_columns: Invoices_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_UsersArgs = {
  _set?: Maybe<Users_Set_Input>;
  where: Users_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Users_By_PkArgs = {
  _set?: Maybe<Users_Set_Input>;
  pk_columns: Users_Pk_Columns_Input;
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
  /** An array relationship */
  invoices: Array<Invoices>;
  /** An aggregate relationship */
  invoices_aggregate: Invoices_Aggregate;
  /** fetch data from the table: "invoices" using primary key columns */
  invoices_by_pk?: Maybe<Invoices>;
  /** fetch data from the table: "users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "users" */
  users_aggregate: Users_Aggregate;
  /** fetch data from the table: "users" using primary key columns */
  users_by_pk?: Maybe<Users>;
};


export type Query_RootInvoicesArgs = {
  distinct_on?: Maybe<Array<Invoices_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Invoices_Order_By>>;
  where?: Maybe<Invoices_Bool_Exp>;
};


export type Query_RootInvoices_AggregateArgs = {
  distinct_on?: Maybe<Array<Invoices_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Invoices_Order_By>>;
  where?: Maybe<Invoices_Bool_Exp>;
};


export type Query_RootInvoices_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootUsersArgs = {
  distinct_on?: Maybe<Array<Users_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Users_Order_By>>;
  where?: Maybe<Users_Bool_Exp>;
};


export type Query_RootUsers_AggregateArgs = {
  distinct_on?: Maybe<Array<Users_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Users_Order_By>>;
  where?: Maybe<Users_Bool_Exp>;
};


export type Query_RootUsers_By_PkArgs = {
  id: Scalars['uuid'];
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: Maybe<Scalars['String']>;
  _gt?: Maybe<Scalars['String']>;
  _gte?: Maybe<Scalars['String']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: Maybe<Scalars['String']>;
  _in?: Maybe<Array<Scalars['String']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: Maybe<Scalars['String']>;
  _is_null?: Maybe<Scalars['Boolean']>;
  /** does the column match the given pattern */
  _like?: Maybe<Scalars['String']>;
  _lt?: Maybe<Scalars['String']>;
  _lte?: Maybe<Scalars['String']>;
  _neq?: Maybe<Scalars['String']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: Maybe<Scalars['String']>;
  _nin?: Maybe<Array<Scalars['String']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: Maybe<Scalars['String']>;
  /** does the column NOT match the given pattern */
  _nlike?: Maybe<Scalars['String']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: Maybe<Scalars['String']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: Maybe<Scalars['String']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: Maybe<Scalars['String']>;
  /** does the column match the given SQL regular expression */
  _similar?: Maybe<Scalars['String']>;
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** An array relationship */
  invoices: Array<Invoices>;
  /** An aggregate relationship */
  invoices_aggregate: Invoices_Aggregate;
  /** fetch data from the table: "invoices" using primary key columns */
  invoices_by_pk?: Maybe<Invoices>;
  /** fetch data from the table: "users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "users" */
  users_aggregate: Users_Aggregate;
  /** fetch data from the table: "users" using primary key columns */
  users_by_pk?: Maybe<Users>;
};


export type Subscription_RootInvoicesArgs = {
  distinct_on?: Maybe<Array<Invoices_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Invoices_Order_By>>;
  where?: Maybe<Invoices_Bool_Exp>;
};


export type Subscription_RootInvoices_AggregateArgs = {
  distinct_on?: Maybe<Array<Invoices_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Invoices_Order_By>>;
  where?: Maybe<Invoices_Bool_Exp>;
};


export type Subscription_RootInvoices_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootUsersArgs = {
  distinct_on?: Maybe<Array<Users_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Users_Order_By>>;
  where?: Maybe<Users_Bool_Exp>;
};


export type Subscription_RootUsers_AggregateArgs = {
  distinct_on?: Maybe<Array<Users_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Users_Order_By>>;
  where?: Maybe<Users_Bool_Exp>;
};


export type Subscription_RootUsers_By_PkArgs = {
  id: Scalars['uuid'];
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: Maybe<Scalars['timestamptz']>;
  _gt?: Maybe<Scalars['timestamptz']>;
  _gte?: Maybe<Scalars['timestamptz']>;
  _in?: Maybe<Array<Scalars['timestamptz']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['timestamptz']>;
  _lte?: Maybe<Scalars['timestamptz']>;
  _neq?: Maybe<Scalars['timestamptz']>;
  _nin?: Maybe<Array<Scalars['timestamptz']>>;
};

/** columns and relationships of "users" */
export type Users = {
  __typename?: 'users';
  address: Scalars['String'];
  created_at?: Maybe<Scalars['timestamptz']>;
  id: Scalars['uuid'];
  /** An array relationship */
  invoices: Array<Invoices>;
  /** An aggregate relationship */
  invoices_aggregate: Invoices_Aggregate;
  last_upsert_at?: Maybe<Scalars['timestamptz']>;
};


/** columns and relationships of "users" */
export type UsersInvoicesArgs = {
  distinct_on?: Maybe<Array<Invoices_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Invoices_Order_By>>;
  where?: Maybe<Invoices_Bool_Exp>;
};


/** columns and relationships of "users" */
export type UsersInvoices_AggregateArgs = {
  distinct_on?: Maybe<Array<Invoices_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Invoices_Order_By>>;
  where?: Maybe<Invoices_Bool_Exp>;
};

/** aggregated selection of "users" */
export type Users_Aggregate = {
  __typename?: 'users_aggregate';
  aggregate?: Maybe<Users_Aggregate_Fields>;
  nodes: Array<Users>;
};

/** aggregate fields of "users" */
export type Users_Aggregate_Fields = {
  __typename?: 'users_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Users_Max_Fields>;
  min?: Maybe<Users_Min_Fields>;
};


/** aggregate fields of "users" */
export type Users_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Users_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "users". All fields are combined with a logical 'AND'. */
export type Users_Bool_Exp = {
  _and?: Maybe<Array<Users_Bool_Exp>>;
  _not?: Maybe<Users_Bool_Exp>;
  _or?: Maybe<Array<Users_Bool_Exp>>;
  address?: Maybe<String_Comparison_Exp>;
  created_at?: Maybe<Timestamptz_Comparison_Exp>;
  id?: Maybe<Uuid_Comparison_Exp>;
  invoices?: Maybe<Invoices_Bool_Exp>;
  last_upsert_at?: Maybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "users" */
export enum Users_Constraint {
  /** unique or primary key constraint */
  UserPkey = 'user_pkey',
  /** unique or primary key constraint */
  UsersAddressKey = 'users_address_key'
}

/** input type for inserting data into table "users" */
export type Users_Insert_Input = {
  address?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  invoices?: Maybe<Invoices_Arr_Rel_Insert_Input>;
  last_upsert_at?: Maybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Users_Max_Fields = {
  __typename?: 'users_max_fields';
  address?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  last_upsert_at?: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type Users_Min_Fields = {
  __typename?: 'users_min_fields';
  address?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  last_upsert_at?: Maybe<Scalars['timestamptz']>;
};

/** response of any mutation on the table "users" */
export type Users_Mutation_Response = {
  __typename?: 'users_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Users>;
};

/** input type for inserting object relation for remote table "users" */
export type Users_Obj_Rel_Insert_Input = {
  data: Users_Insert_Input;
  /** on conflict condition */
  on_conflict?: Maybe<Users_On_Conflict>;
};

/** on conflict condition type for table "users" */
export type Users_On_Conflict = {
  constraint: Users_Constraint;
  update_columns?: Array<Users_Update_Column>;
  where?: Maybe<Users_Bool_Exp>;
};

/** Ordering options when selecting data from "users". */
export type Users_Order_By = {
  address?: Maybe<Order_By>;
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  invoices_aggregate?: Maybe<Invoices_Aggregate_Order_By>;
  last_upsert_at?: Maybe<Order_By>;
};

/** primary key columns input for table: users */
export type Users_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "users" */
export enum Users_Select_Column {
  /** column name */
  Address = 'address',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  LastUpsertAt = 'last_upsert_at'
}

/** input type for updating data in table "users" */
export type Users_Set_Input = {
  address?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  last_upsert_at?: Maybe<Scalars['timestamptz']>;
};

/** update columns of table "users" */
export enum Users_Update_Column {
  /** column name */
  Address = 'address',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  LastUpsertAt = 'last_upsert_at'
}

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
  _eq?: Maybe<Scalars['uuid']>;
  _gt?: Maybe<Scalars['uuid']>;
  _gte?: Maybe<Scalars['uuid']>;
  _in?: Maybe<Array<Scalars['uuid']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['uuid']>;
  _lte?: Maybe<Scalars['uuid']>;
  _neq?: Maybe<Scalars['uuid']>;
  _nin?: Maybe<Array<Scalars['uuid']>>;
};

export type ValidateSignatureInput = {
  public_address: Scalars['String'];
  signature: Scalars['String'];
};

export type ValidateSignatureOutput = {
  __typename?: 'ValidateSignatureOutput';
  accessToken: Scalars['String'];
};

export type InsertInvoiceMutationVariables = Exact<{
  object: Invoices_Insert_Input;
}>;


export type InsertInvoiceMutation = { __typename?: 'mutation_root', insert_invoices_one?: { __typename?: 'invoices', id: any } | null | undefined };

export type UpsertUserMutationVariables = Exact<{
  address: Scalars['String'];
}>;


export type UpsertUserMutation = { __typename?: 'mutation_root', insert_users_one?: { __typename?: 'users', id: any, address: string } | null | undefined };

export type GetInvoiceQueryVariables = Exact<{
  id: Scalars['uuid'];
}>;


export type GetInvoiceQuery = { __typename?: 'query_root', invoices_by_pk?: { __typename?: 'invoices', id: any, recipient_id: any, recipient_token_address: string, recipient_token_amount_raw: string, chain_id: number, status: string, transaction_id?: string | null | undefined, recipient_user: { __typename?: 'users', address: string } } | null | undefined };

export type GetUserByPublicKeyQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type GetUserByPublicKeyQuery = { __typename?: 'query_root', users: Array<{ __typename?: 'users', id: any }> };

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { __typename?: 'query_root', users: Array<{ __typename?: 'users', id: any, address: string }> };


export const InsertInvoiceDocument = gql`
    mutation insertInvoice($object: invoices_insert_input!) {
  insert_invoices_one(object: $object) {
    id
  }
}
    `;
export type InsertInvoiceMutationFn = Apollo.MutationFunction<InsertInvoiceMutation, InsertInvoiceMutationVariables>;

/**
 * __useInsertInvoiceMutation__
 *
 * To run a mutation, you first call `useInsertInvoiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInsertInvoiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [insertInvoiceMutation, { data, loading, error }] = useInsertInvoiceMutation({
 *   variables: {
 *      object: // value for 'object'
 *   },
 * });
 */
export function useInsertInvoiceMutation(baseOptions?: Apollo.MutationHookOptions<InsertInvoiceMutation, InsertInvoiceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InsertInvoiceMutation, InsertInvoiceMutationVariables>(InsertInvoiceDocument, options);
      }
export type InsertInvoiceMutationHookResult = ReturnType<typeof useInsertInvoiceMutation>;
export type InsertInvoiceMutationResult = Apollo.MutationResult<InsertInvoiceMutation>;
export type InsertInvoiceMutationOptions = Apollo.BaseMutationOptions<InsertInvoiceMutation, InsertInvoiceMutationVariables>;
export const UpsertUserDocument = gql`
    mutation upsertUser($address: String!) {
  insert_users_one(object: {address: $address}, on_conflict: {constraint: users_address_key, update_columns: [last_upsert_at]}) {
    id
    address
  }
}
    `;
export type UpsertUserMutationFn = Apollo.MutationFunction<UpsertUserMutation, UpsertUserMutationVariables>;

/**
 * __useUpsertUserMutation__
 *
 * To run a mutation, you first call `useUpsertUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpsertUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [upsertUserMutation, { data, loading, error }] = useUpsertUserMutation({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useUpsertUserMutation(baseOptions?: Apollo.MutationHookOptions<UpsertUserMutation, UpsertUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpsertUserMutation, UpsertUserMutationVariables>(UpsertUserDocument, options);
      }
export type UpsertUserMutationHookResult = ReturnType<typeof useUpsertUserMutation>;
export type UpsertUserMutationResult = Apollo.MutationResult<UpsertUserMutation>;
export type UpsertUserMutationOptions = Apollo.BaseMutationOptions<UpsertUserMutation, UpsertUserMutationVariables>;
export const GetInvoiceDocument = gql`
    query getInvoice($id: uuid!) {
  invoices_by_pk(id: $id) {
    id
    recipient_id
    recipient_token_address
    recipient_token_amount_raw
    chain_id
    status
    transaction_id
    recipient_user {
      address
    }
  }
}
    `;

/**
 * __useGetInvoiceQuery__
 *
 * To run a query within a React component, call `useGetInvoiceQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInvoiceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInvoiceQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetInvoiceQuery(baseOptions: Apollo.QueryHookOptions<GetInvoiceQuery, GetInvoiceQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetInvoiceQuery, GetInvoiceQueryVariables>(GetInvoiceDocument, options);
      }
export function useGetInvoiceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetInvoiceQuery, GetInvoiceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetInvoiceQuery, GetInvoiceQueryVariables>(GetInvoiceDocument, options);
        }
export type GetInvoiceQueryHookResult = ReturnType<typeof useGetInvoiceQuery>;
export type GetInvoiceLazyQueryHookResult = ReturnType<typeof useGetInvoiceLazyQuery>;
export type GetInvoiceQueryResult = Apollo.QueryResult<GetInvoiceQuery, GetInvoiceQueryVariables>;
export const GetUserByPublicKeyDocument = gql`
    query getUserByPublicKey($address: String!) {
  users(limit: 1, where: {address: {_eq: $address}}) {
    id
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
 *      address: // value for 'address'
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
  users {
    id
    address
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