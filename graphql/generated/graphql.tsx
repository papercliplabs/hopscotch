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
  bigint: any;
  timestamp: any;
  timestamptz: any;
  uuid: any;
};

/** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
export type Bigint_Comparison_Exp = {
  _eq?: Maybe<Scalars['bigint']>;
  _gt?: Maybe<Scalars['bigint']>;
  _gte?: Maybe<Scalars['bigint']>;
  _in?: Maybe<Array<Scalars['bigint']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['bigint']>;
  _lte?: Maybe<Scalars['bigint']>;
  _neq?: Maybe<Scalars['bigint']>;
  _nin?: Maybe<Array<Scalars['bigint']>>;
};

/** columns and relationships of "clients" */
export type Clients = {
  __typename?: 'clients';
  color: Scalars['String'];
  id: Scalars['uuid'];
  /** An array relationship */
  invoices: Array<Invoices>;
  /** An aggregate relationship */
  invoices_aggregate: Invoices_Aggregate;
  name: Scalars['String'];
  /** An object relationship */
  owner: Users;
  user_id: Scalars['uuid'];
};


/** columns and relationships of "clients" */
export type ClientsInvoicesArgs = {
  distinct_on?: Maybe<Array<Invoices_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Invoices_Order_By>>;
  where?: Maybe<Invoices_Bool_Exp>;
};


/** columns and relationships of "clients" */
export type ClientsInvoices_AggregateArgs = {
  distinct_on?: Maybe<Array<Invoices_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Invoices_Order_By>>;
  where?: Maybe<Invoices_Bool_Exp>;
};

/** aggregated selection of "clients" */
export type Clients_Aggregate = {
  __typename?: 'clients_aggregate';
  aggregate?: Maybe<Clients_Aggregate_Fields>;
  nodes: Array<Clients>;
};

/** aggregate fields of "clients" */
export type Clients_Aggregate_Fields = {
  __typename?: 'clients_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Clients_Max_Fields>;
  min?: Maybe<Clients_Min_Fields>;
};


/** aggregate fields of "clients" */
export type Clients_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Clients_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "clients" */
export type Clients_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<Clients_Max_Order_By>;
  min?: Maybe<Clients_Min_Order_By>;
};

/** input type for inserting array relation for remote table "clients" */
export type Clients_Arr_Rel_Insert_Input = {
  data: Array<Clients_Insert_Input>;
  /** on conflict condition */
  on_conflict?: Maybe<Clients_On_Conflict>;
};

/** Boolean expression to filter rows from the table "clients". All fields are combined with a logical 'AND'. */
export type Clients_Bool_Exp = {
  _and?: Maybe<Array<Clients_Bool_Exp>>;
  _not?: Maybe<Clients_Bool_Exp>;
  _or?: Maybe<Array<Clients_Bool_Exp>>;
  color?: Maybe<String_Comparison_Exp>;
  id?: Maybe<Uuid_Comparison_Exp>;
  invoices?: Maybe<Invoices_Bool_Exp>;
  name?: Maybe<String_Comparison_Exp>;
  owner?: Maybe<Users_Bool_Exp>;
  user_id?: Maybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "clients" */
export enum Clients_Constraint {
  /** unique or primary key constraint */
  ClientPkey = 'client_pkey'
}

/** input type for inserting data into table "clients" */
export type Clients_Insert_Input = {
  color?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  invoices?: Maybe<Invoices_Arr_Rel_Insert_Input>;
  name?: Maybe<Scalars['String']>;
  owner?: Maybe<Users_Obj_Rel_Insert_Input>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Clients_Max_Fields = {
  __typename?: 'clients_max_fields';
  color?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "clients" */
export type Clients_Max_Order_By = {
  color?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  name?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Clients_Min_Fields = {
  __typename?: 'clients_min_fields';
  color?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "clients" */
export type Clients_Min_Order_By = {
  color?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  name?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** response of any mutation on the table "clients" */
export type Clients_Mutation_Response = {
  __typename?: 'clients_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Clients>;
};

/** input type for inserting object relation for remote table "clients" */
export type Clients_Obj_Rel_Insert_Input = {
  data: Clients_Insert_Input;
  /** on conflict condition */
  on_conflict?: Maybe<Clients_On_Conflict>;
};

/** on conflict condition type for table "clients" */
export type Clients_On_Conflict = {
  constraint: Clients_Constraint;
  update_columns?: Array<Clients_Update_Column>;
  where?: Maybe<Clients_Bool_Exp>;
};

/** Ordering options when selecting data from "clients". */
export type Clients_Order_By = {
  color?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  invoices_aggregate?: Maybe<Invoices_Aggregate_Order_By>;
  name?: Maybe<Order_By>;
  owner?: Maybe<Users_Order_By>;
  user_id?: Maybe<Order_By>;
};

/** primary key columns input for table: clients */
export type Clients_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "clients" */
export enum Clients_Select_Column {
  /** column name */
  Color = 'color',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  UserId = 'user_id'
}

/** input type for updating data in table "clients" */
export type Clients_Set_Input = {
  color?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** update columns of table "clients" */
export enum Clients_Update_Column {
  /** column name */
  Color = 'color',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  UserId = 'user_id'
}

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
  amount: Scalars['bigint'];
  chain_id: Scalars['Int'];
  /** An object relationship */
  client: Clients;
  client_id: Scalars['uuid'];
  id: Scalars['uuid'];
  invoice_identifier: Scalars['String'];
  note: Scalars['String'];
  /** An object relationship */
  owner: Users;
  status: Scalars['String'];
  token_address: Scalars['String'];
  transaction_id: Scalars['String'];
  user_id: Scalars['uuid'];
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
  amount?: Maybe<Scalars['Float']>;
  chain_id?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "invoices" */
export type Invoices_Avg_Order_By = {
  amount?: Maybe<Order_By>;
  chain_id?: Maybe<Order_By>;
};

/** Boolean expression to filter rows from the table "invoices". All fields are combined with a logical 'AND'. */
export type Invoices_Bool_Exp = {
  _and?: Maybe<Array<Invoices_Bool_Exp>>;
  _not?: Maybe<Invoices_Bool_Exp>;
  _or?: Maybe<Array<Invoices_Bool_Exp>>;
  amount?: Maybe<Bigint_Comparison_Exp>;
  chain_id?: Maybe<Int_Comparison_Exp>;
  client?: Maybe<Clients_Bool_Exp>;
  client_id?: Maybe<Uuid_Comparison_Exp>;
  id?: Maybe<Uuid_Comparison_Exp>;
  invoice_identifier?: Maybe<String_Comparison_Exp>;
  note?: Maybe<String_Comparison_Exp>;
  owner?: Maybe<Users_Bool_Exp>;
  status?: Maybe<String_Comparison_Exp>;
  token_address?: Maybe<String_Comparison_Exp>;
  transaction_id?: Maybe<String_Comparison_Exp>;
  user_id?: Maybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "invoices" */
export enum Invoices_Constraint {
  /** unique or primary key constraint */
  InvoicePkey = 'invoice_pkey'
}

/** input type for incrementing numeric columns in table "invoices" */
export type Invoices_Inc_Input = {
  amount?: Maybe<Scalars['bigint']>;
  chain_id?: Maybe<Scalars['Int']>;
};

/** input type for inserting data into table "invoices" */
export type Invoices_Insert_Input = {
  amount?: Maybe<Scalars['bigint']>;
  chain_id?: Maybe<Scalars['Int']>;
  client?: Maybe<Clients_Obj_Rel_Insert_Input>;
  client_id?: Maybe<Scalars['uuid']>;
  id?: Maybe<Scalars['uuid']>;
  invoice_identifier?: Maybe<Scalars['String']>;
  note?: Maybe<Scalars['String']>;
  owner?: Maybe<Users_Obj_Rel_Insert_Input>;
  status?: Maybe<Scalars['String']>;
  token_address?: Maybe<Scalars['String']>;
  transaction_id?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Invoices_Max_Fields = {
  __typename?: 'invoices_max_fields';
  amount?: Maybe<Scalars['bigint']>;
  chain_id?: Maybe<Scalars['Int']>;
  client_id?: Maybe<Scalars['uuid']>;
  id?: Maybe<Scalars['uuid']>;
  invoice_identifier?: Maybe<Scalars['String']>;
  note?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  token_address?: Maybe<Scalars['String']>;
  transaction_id?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "invoices" */
export type Invoices_Max_Order_By = {
  amount?: Maybe<Order_By>;
  chain_id?: Maybe<Order_By>;
  client_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  invoice_identifier?: Maybe<Order_By>;
  note?: Maybe<Order_By>;
  status?: Maybe<Order_By>;
  token_address?: Maybe<Order_By>;
  transaction_id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Invoices_Min_Fields = {
  __typename?: 'invoices_min_fields';
  amount?: Maybe<Scalars['bigint']>;
  chain_id?: Maybe<Scalars['Int']>;
  client_id?: Maybe<Scalars['uuid']>;
  id?: Maybe<Scalars['uuid']>;
  invoice_identifier?: Maybe<Scalars['String']>;
  note?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  token_address?: Maybe<Scalars['String']>;
  transaction_id?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "invoices" */
export type Invoices_Min_Order_By = {
  amount?: Maybe<Order_By>;
  chain_id?: Maybe<Order_By>;
  client_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  invoice_identifier?: Maybe<Order_By>;
  note?: Maybe<Order_By>;
  status?: Maybe<Order_By>;
  token_address?: Maybe<Order_By>;
  transaction_id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
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
  amount?: Maybe<Order_By>;
  chain_id?: Maybe<Order_By>;
  client?: Maybe<Clients_Order_By>;
  client_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  invoice_identifier?: Maybe<Order_By>;
  note?: Maybe<Order_By>;
  owner?: Maybe<Users_Order_By>;
  status?: Maybe<Order_By>;
  token_address?: Maybe<Order_By>;
  transaction_id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** primary key columns input for table: invoices */
export type Invoices_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "invoices" */
export enum Invoices_Select_Column {
  /** column name */
  Amount = 'amount',
  /** column name */
  ChainId = 'chain_id',
  /** column name */
  ClientId = 'client_id',
  /** column name */
  Id = 'id',
  /** column name */
  InvoiceIdentifier = 'invoice_identifier',
  /** column name */
  Note = 'note',
  /** column name */
  Status = 'status',
  /** column name */
  TokenAddress = 'token_address',
  /** column name */
  TransactionId = 'transaction_id',
  /** column name */
  UserId = 'user_id'
}

/** input type for updating data in table "invoices" */
export type Invoices_Set_Input = {
  amount?: Maybe<Scalars['bigint']>;
  chain_id?: Maybe<Scalars['Int']>;
  client_id?: Maybe<Scalars['uuid']>;
  id?: Maybe<Scalars['uuid']>;
  invoice_identifier?: Maybe<Scalars['String']>;
  note?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  token_address?: Maybe<Scalars['String']>;
  transaction_id?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** aggregate stddev on columns */
export type Invoices_Stddev_Fields = {
  __typename?: 'invoices_stddev_fields';
  amount?: Maybe<Scalars['Float']>;
  chain_id?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "invoices" */
export type Invoices_Stddev_Order_By = {
  amount?: Maybe<Order_By>;
  chain_id?: Maybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Invoices_Stddev_Pop_Fields = {
  __typename?: 'invoices_stddev_pop_fields';
  amount?: Maybe<Scalars['Float']>;
  chain_id?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "invoices" */
export type Invoices_Stddev_Pop_Order_By = {
  amount?: Maybe<Order_By>;
  chain_id?: Maybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Invoices_Stddev_Samp_Fields = {
  __typename?: 'invoices_stddev_samp_fields';
  amount?: Maybe<Scalars['Float']>;
  chain_id?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "invoices" */
export type Invoices_Stddev_Samp_Order_By = {
  amount?: Maybe<Order_By>;
  chain_id?: Maybe<Order_By>;
};

/** aggregate sum on columns */
export type Invoices_Sum_Fields = {
  __typename?: 'invoices_sum_fields';
  amount?: Maybe<Scalars['bigint']>;
  chain_id?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "invoices" */
export type Invoices_Sum_Order_By = {
  amount?: Maybe<Order_By>;
  chain_id?: Maybe<Order_By>;
};

/** update columns of table "invoices" */
export enum Invoices_Update_Column {
  /** column name */
  Amount = 'amount',
  /** column name */
  ChainId = 'chain_id',
  /** column name */
  ClientId = 'client_id',
  /** column name */
  Id = 'id',
  /** column name */
  InvoiceIdentifier = 'invoice_identifier',
  /** column name */
  Note = 'note',
  /** column name */
  Status = 'status',
  /** column name */
  TokenAddress = 'token_address',
  /** column name */
  TransactionId = 'transaction_id',
  /** column name */
  UserId = 'user_id'
}

/** aggregate var_pop on columns */
export type Invoices_Var_Pop_Fields = {
  __typename?: 'invoices_var_pop_fields';
  amount?: Maybe<Scalars['Float']>;
  chain_id?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "invoices" */
export type Invoices_Var_Pop_Order_By = {
  amount?: Maybe<Order_By>;
  chain_id?: Maybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Invoices_Var_Samp_Fields = {
  __typename?: 'invoices_var_samp_fields';
  amount?: Maybe<Scalars['Float']>;
  chain_id?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "invoices" */
export type Invoices_Var_Samp_Order_By = {
  amount?: Maybe<Order_By>;
  chain_id?: Maybe<Order_By>;
};

/** aggregate variance on columns */
export type Invoices_Variance_Fields = {
  __typename?: 'invoices_variance_fields';
  amount?: Maybe<Scalars['Float']>;
  chain_id?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "invoices" */
export type Invoices_Variance_Order_By = {
  amount?: Maybe<Order_By>;
  chain_id?: Maybe<Order_By>;
};

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** delete data from the table: "clients" */
  delete_clients?: Maybe<Clients_Mutation_Response>;
  /** delete single row from the table: "clients" */
  delete_clients_by_pk?: Maybe<Clients>;
  /** delete data from the table: "invoices" */
  delete_invoices?: Maybe<Invoices_Mutation_Response>;
  /** delete single row from the table: "invoices" */
  delete_invoices_by_pk?: Maybe<Invoices>;
  /** delete data from the table: "user_info" */
  delete_user_info?: Maybe<User_Info_Mutation_Response>;
  /** delete single row from the table: "user_info" */
  delete_user_info_by_pk?: Maybe<User_Info>;
  /** delete data from the table: "users" */
  delete_users?: Maybe<Users_Mutation_Response>;
  /** delete single row from the table: "users" */
  delete_users_by_pk?: Maybe<Users>;
  /** insert data into the table: "clients" */
  insert_clients?: Maybe<Clients_Mutation_Response>;
  /** insert a single row into the table: "clients" */
  insert_clients_one?: Maybe<Clients>;
  /** insert data into the table: "invoices" */
  insert_invoices?: Maybe<Invoices_Mutation_Response>;
  /** insert a single row into the table: "invoices" */
  insert_invoices_one?: Maybe<Invoices>;
  /** insert data into the table: "user_info" */
  insert_user_info?: Maybe<User_Info_Mutation_Response>;
  /** insert a single row into the table: "user_info" */
  insert_user_info_one?: Maybe<User_Info>;
  /** insert data into the table: "users" */
  insert_users?: Maybe<Users_Mutation_Response>;
  /** insert a single row into the table: "users" */
  insert_users_one?: Maybe<Users>;
  /** execute VOLATILE function "refresh_nonce" which returns "users" */
  refresh_nonce: Array<Users>;
  /** update data of the table: "clients" */
  update_clients?: Maybe<Clients_Mutation_Response>;
  /** update single row of the table: "clients" */
  update_clients_by_pk?: Maybe<Clients>;
  /** update data of the table: "invoices" */
  update_invoices?: Maybe<Invoices_Mutation_Response>;
  /** update single row of the table: "invoices" */
  update_invoices_by_pk?: Maybe<Invoices>;
  /** update data of the table: "user_info" */
  update_user_info?: Maybe<User_Info_Mutation_Response>;
  /** update single row of the table: "user_info" */
  update_user_info_by_pk?: Maybe<User_Info>;
  /** update data of the table: "users" */
  update_users?: Maybe<Users_Mutation_Response>;
  /** update single row of the table: "users" */
  update_users_by_pk?: Maybe<Users>;
  validate_signature?: Maybe<ValidateSignatureOutput>;
};


/** mutation root */
export type Mutation_RootDelete_ClientsArgs = {
  where: Clients_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Clients_By_PkArgs = {
  id: Scalars['uuid'];
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
export type Mutation_RootDelete_User_InfoArgs = {
  where: User_Info_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_User_Info_By_PkArgs = {
  user_id: Scalars['uuid'];
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
export type Mutation_RootInsert_ClientsArgs = {
  objects: Array<Clients_Insert_Input>;
  on_conflict?: Maybe<Clients_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Clients_OneArgs = {
  object: Clients_Insert_Input;
  on_conflict?: Maybe<Clients_On_Conflict>;
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
export type Mutation_RootInsert_User_InfoArgs = {
  objects: Array<User_Info_Insert_Input>;
  on_conflict?: Maybe<User_Info_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_User_Info_OneArgs = {
  object: User_Info_Insert_Input;
  on_conflict?: Maybe<User_Info_On_Conflict>;
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
export type Mutation_RootRefresh_NonceArgs = {
  args: Refresh_Nonce_Args;
  distinct_on?: Maybe<Array<Users_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Users_Order_By>>;
  where?: Maybe<Users_Bool_Exp>;
};


/** mutation root */
export type Mutation_RootUpdate_ClientsArgs = {
  _set?: Maybe<Clients_Set_Input>;
  where: Clients_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Clients_By_PkArgs = {
  _set?: Maybe<Clients_Set_Input>;
  pk_columns: Clients_Pk_Columns_Input;
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
export type Mutation_RootUpdate_User_InfoArgs = {
  _set?: Maybe<User_Info_Set_Input>;
  where: User_Info_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_User_Info_By_PkArgs = {
  _set?: Maybe<User_Info_Set_Input>;
  pk_columns: User_Info_Pk_Columns_Input;
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
  clients: Array<Clients>;
  /** An aggregate relationship */
  clients_aggregate: Clients_Aggregate;
  /** fetch data from the table: "clients" using primary key columns */
  clients_by_pk?: Maybe<Clients>;
  /** An array relationship */
  invoices: Array<Invoices>;
  /** An aggregate relationship */
  invoices_aggregate: Invoices_Aggregate;
  /** fetch data from the table: "invoices" using primary key columns */
  invoices_by_pk?: Maybe<Invoices>;
  /** fetch data from the table: "user_info" */
  user_info: Array<User_Info>;
  /** fetch aggregated fields from the table: "user_info" */
  user_info_aggregate: User_Info_Aggregate;
  /** fetch data from the table: "user_info" using primary key columns */
  user_info_by_pk?: Maybe<User_Info>;
  /** fetch data from the table: "users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "users" */
  users_aggregate: Users_Aggregate;
  /** fetch data from the table: "users" using primary key columns */
  users_by_pk?: Maybe<Users>;
};


export type Query_RootClientsArgs = {
  distinct_on?: Maybe<Array<Clients_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Clients_Order_By>>;
  where?: Maybe<Clients_Bool_Exp>;
};


export type Query_RootClients_AggregateArgs = {
  distinct_on?: Maybe<Array<Clients_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Clients_Order_By>>;
  where?: Maybe<Clients_Bool_Exp>;
};


export type Query_RootClients_By_PkArgs = {
  id: Scalars['uuid'];
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


export type Query_RootUser_InfoArgs = {
  distinct_on?: Maybe<Array<User_Info_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<User_Info_Order_By>>;
  where?: Maybe<User_Info_Bool_Exp>;
};


export type Query_RootUser_Info_AggregateArgs = {
  distinct_on?: Maybe<Array<User_Info_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<User_Info_Order_By>>;
  where?: Maybe<User_Info_Bool_Exp>;
};


export type Query_RootUser_Info_By_PkArgs = {
  user_id: Scalars['uuid'];
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

export type Refresh_Nonce_Args = {
  pkey?: Maybe<Scalars['String']>;
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
  clients: Array<Clients>;
  /** An aggregate relationship */
  clients_aggregate: Clients_Aggregate;
  /** fetch data from the table: "clients" using primary key columns */
  clients_by_pk?: Maybe<Clients>;
  /** An array relationship */
  invoices: Array<Invoices>;
  /** An aggregate relationship */
  invoices_aggregate: Invoices_Aggregate;
  /** fetch data from the table: "invoices" using primary key columns */
  invoices_by_pk?: Maybe<Invoices>;
  /** fetch data from the table: "user_info" */
  user_info: Array<User_Info>;
  /** fetch aggregated fields from the table: "user_info" */
  user_info_aggregate: User_Info_Aggregate;
  /** fetch data from the table: "user_info" using primary key columns */
  user_info_by_pk?: Maybe<User_Info>;
  /** fetch data from the table: "users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "users" */
  users_aggregate: Users_Aggregate;
  /** fetch data from the table: "users" using primary key columns */
  users_by_pk?: Maybe<Users>;
};


export type Subscription_RootClientsArgs = {
  distinct_on?: Maybe<Array<Clients_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Clients_Order_By>>;
  where?: Maybe<Clients_Bool_Exp>;
};


export type Subscription_RootClients_AggregateArgs = {
  distinct_on?: Maybe<Array<Clients_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Clients_Order_By>>;
  where?: Maybe<Clients_Bool_Exp>;
};


export type Subscription_RootClients_By_PkArgs = {
  id: Scalars['uuid'];
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


export type Subscription_RootUser_InfoArgs = {
  distinct_on?: Maybe<Array<User_Info_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<User_Info_Order_By>>;
  where?: Maybe<User_Info_Bool_Exp>;
};


export type Subscription_RootUser_Info_AggregateArgs = {
  distinct_on?: Maybe<Array<User_Info_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<User_Info_Order_By>>;
  where?: Maybe<User_Info_Bool_Exp>;
};


export type Subscription_RootUser_Info_By_PkArgs = {
  user_id: Scalars['uuid'];
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

/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
export type Timestamp_Comparison_Exp = {
  _eq?: Maybe<Scalars['timestamp']>;
  _gt?: Maybe<Scalars['timestamp']>;
  _gte?: Maybe<Scalars['timestamp']>;
  _in?: Maybe<Array<Scalars['timestamp']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['timestamp']>;
  _lte?: Maybe<Scalars['timestamp']>;
  _neq?: Maybe<Scalars['timestamp']>;
  _nin?: Maybe<Array<Scalars['timestamp']>>;
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

/** columns and relationships of "user_info" */
export type User_Info = {
  __typename?: 'user_info';
  email?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  user_id: Scalars['uuid'];
};

/** aggregated selection of "user_info" */
export type User_Info_Aggregate = {
  __typename?: 'user_info_aggregate';
  aggregate?: Maybe<User_Info_Aggregate_Fields>;
  nodes: Array<User_Info>;
};

/** aggregate fields of "user_info" */
export type User_Info_Aggregate_Fields = {
  __typename?: 'user_info_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<User_Info_Max_Fields>;
  min?: Maybe<User_Info_Min_Fields>;
};


/** aggregate fields of "user_info" */
export type User_Info_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<User_Info_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "user_info". All fields are combined with a logical 'AND'. */
export type User_Info_Bool_Exp = {
  _and?: Maybe<Array<User_Info_Bool_Exp>>;
  _not?: Maybe<User_Info_Bool_Exp>;
  _or?: Maybe<Array<User_Info_Bool_Exp>>;
  email?: Maybe<String_Comparison_Exp>;
  name?: Maybe<String_Comparison_Exp>;
  user_id?: Maybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "user_info" */
export enum User_Info_Constraint {
  /** unique or primary key constraint */
  UserInfoPkey = 'user_info_pkey'
}

/** input type for inserting data into table "user_info" */
export type User_Info_Insert_Input = {
  email?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type User_Info_Max_Fields = {
  __typename?: 'user_info_max_fields';
  email?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** aggregate min on columns */
export type User_Info_Min_Fields = {
  __typename?: 'user_info_min_fields';
  email?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** response of any mutation on the table "user_info" */
export type User_Info_Mutation_Response = {
  __typename?: 'user_info_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<User_Info>;
};

/** input type for inserting object relation for remote table "user_info" */
export type User_Info_Obj_Rel_Insert_Input = {
  data: User_Info_Insert_Input;
  /** on conflict condition */
  on_conflict?: Maybe<User_Info_On_Conflict>;
};

/** on conflict condition type for table "user_info" */
export type User_Info_On_Conflict = {
  constraint: User_Info_Constraint;
  update_columns?: Array<User_Info_Update_Column>;
  where?: Maybe<User_Info_Bool_Exp>;
};

/** Ordering options when selecting data from "user_info". */
export type User_Info_Order_By = {
  email?: Maybe<Order_By>;
  name?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** primary key columns input for table: user_info */
export type User_Info_Pk_Columns_Input = {
  user_id: Scalars['uuid'];
};

/** select columns of table "user_info" */
export enum User_Info_Select_Column {
  /** column name */
  Email = 'email',
  /** column name */
  Name = 'name',
  /** column name */
  UserId = 'user_id'
}

/** input type for updating data in table "user_info" */
export type User_Info_Set_Input = {
  email?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** update columns of table "user_info" */
export enum User_Info_Update_Column {
  /** column name */
  Email = 'email',
  /** column name */
  Name = 'name',
  /** column name */
  UserId = 'user_id'
}

/** columns and relationships of "users" */
export type Users = {
  __typename?: 'users';
  client_last_requested: Scalars['timestamp'];
  /** An array relationship */
  clients: Array<Clients>;
  /** An aggregate relationship */
  clients_aggregate: Clients_Aggregate;
  created_at?: Maybe<Scalars['timestamptz']>;
  id: Scalars['uuid'];
  /** An array relationship */
  invoices: Array<Invoices>;
  /** An aggregate relationship */
  invoices_aggregate: Invoices_Aggregate;
  nonce: Scalars['uuid'];
  public_key: Scalars['String'];
  updated_at?: Maybe<Scalars['timestamptz']>;
  /** An object relationship */
  user_info?: Maybe<User_Info>;
};


/** columns and relationships of "users" */
export type UsersClientsArgs = {
  distinct_on?: Maybe<Array<Clients_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Clients_Order_By>>;
  where?: Maybe<Clients_Bool_Exp>;
};


/** columns and relationships of "users" */
export type UsersClients_AggregateArgs = {
  distinct_on?: Maybe<Array<Clients_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Clients_Order_By>>;
  where?: Maybe<Clients_Bool_Exp>;
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
  client_last_requested?: Maybe<Timestamp_Comparison_Exp>;
  clients?: Maybe<Clients_Bool_Exp>;
  created_at?: Maybe<Timestamptz_Comparison_Exp>;
  id?: Maybe<Uuid_Comparison_Exp>;
  invoices?: Maybe<Invoices_Bool_Exp>;
  nonce?: Maybe<Uuid_Comparison_Exp>;
  public_key?: Maybe<String_Comparison_Exp>;
  updated_at?: Maybe<Timestamptz_Comparison_Exp>;
  user_info?: Maybe<User_Info_Bool_Exp>;
};

/** unique or primary key constraints on table "users" */
export enum Users_Constraint {
  /** unique or primary key constraint */
  UserPkey = 'user_pkey',
  /** unique or primary key constraint */
  UserPublicKeyKey = 'user_public_key_key'
}

/** input type for inserting data into table "users" */
export type Users_Insert_Input = {
  client_last_requested?: Maybe<Scalars['timestamp']>;
  clients?: Maybe<Clients_Arr_Rel_Insert_Input>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  invoices?: Maybe<Invoices_Arr_Rel_Insert_Input>;
  nonce?: Maybe<Scalars['uuid']>;
  public_key?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  user_info?: Maybe<User_Info_Obj_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Users_Max_Fields = {
  __typename?: 'users_max_fields';
  client_last_requested?: Maybe<Scalars['timestamp']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  nonce?: Maybe<Scalars['uuid']>;
  public_key?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type Users_Min_Fields = {
  __typename?: 'users_min_fields';
  client_last_requested?: Maybe<Scalars['timestamp']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  nonce?: Maybe<Scalars['uuid']>;
  public_key?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
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
  client_last_requested?: Maybe<Order_By>;
  clients_aggregate?: Maybe<Clients_Aggregate_Order_By>;
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  invoices_aggregate?: Maybe<Invoices_Aggregate_Order_By>;
  nonce?: Maybe<Order_By>;
  public_key?: Maybe<Order_By>;
  updated_at?: Maybe<Order_By>;
  user_info?: Maybe<User_Info_Order_By>;
};

/** primary key columns input for table: users */
export type Users_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "users" */
export enum Users_Select_Column {
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

/** input type for updating data in table "users" */
export type Users_Set_Input = {
  client_last_requested?: Maybe<Scalars['timestamp']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  nonce?: Maybe<Scalars['uuid']>;
  public_key?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** update columns of table "users" */
export enum Users_Update_Column {
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

export type RefreshNonceMutationVariables = Exact<{
  publicKey: Scalars['String'];
}>;


export type RefreshNonceMutation = { __typename?: 'mutation_root', refresh_nonce: Array<{ __typename?: 'users', id: any, nonce: any, public_key: string }> };

export type UpsertPublicUserMutationVariables = Exact<{
  publicKey: Scalars['String'];
}>;


export type UpsertPublicUserMutation = { __typename?: 'mutation_root', insert_users_one?: { __typename?: 'users', id: any, public_key: string, nonce: any, client_last_requested: any } | null | undefined };

export type ValidateSignatureMutationVariables = Exact<{
  publicKey: Scalars['String'];
  signature: Scalars['String'];
}>;


export type ValidateSignatureMutation = { __typename?: 'mutation_root', validate_signature?: { __typename?: 'ValidateSignatureOutput', accessToken: string } | null | undefined };

export type GetCurrentUserInfoQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserInfoQuery = { __typename?: 'query_root', user_info: Array<{ __typename?: 'user_info', user_id: any, name?: string | null | undefined, email?: string | null | undefined }> };

export type GetUserByPublicKeyQueryVariables = Exact<{
  publicKey: Scalars['String'];
}>;


export type GetUserByPublicKeyQuery = { __typename?: 'query_root', users: Array<{ __typename?: 'users', id: any, nonce: any }> };

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { __typename?: 'query_root', users: Array<{ __typename?: 'users', id: any, public_key: string }> };


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
export const UpsertPublicUserDocument = gql`
    mutation upsertPublicUser($publicKey: String!) {
  insert_users_one(object: {public_key: $publicKey}, on_conflict: {constraint: user_public_key_key, update_columns: [client_last_requested]}) {
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
export const GetCurrentUserInfoDocument = gql`
    query getCurrentUserInfo {
  user_info {
    user_id
    name
    email
  }
}
    `;

/**
 * __useGetCurrentUserInfoQuery__
 *
 * To run a query within a React component, call `useGetCurrentUserInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrentUserInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCurrentUserInfoQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCurrentUserInfoQuery(baseOptions?: Apollo.QueryHookOptions<GetCurrentUserInfoQuery, GetCurrentUserInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCurrentUserInfoQuery, GetCurrentUserInfoQueryVariables>(GetCurrentUserInfoDocument, options);
      }
export function useGetCurrentUserInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCurrentUserInfoQuery, GetCurrentUserInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCurrentUserInfoQuery, GetCurrentUserInfoQueryVariables>(GetCurrentUserInfoDocument, options);
        }
export type GetCurrentUserInfoQueryHookResult = ReturnType<typeof useGetCurrentUserInfoQuery>;
export type GetCurrentUserInfoLazyQueryHookResult = ReturnType<typeof useGetCurrentUserInfoLazyQuery>;
export type GetCurrentUserInfoQueryResult = Apollo.QueryResult<GetCurrentUserInfoQuery, GetCurrentUserInfoQueryVariables>;
export const GetUserByPublicKeyDocument = gql`
    query getUserByPublicKey($publicKey: String!) {
  users(limit: 1, where: {public_key: {_eq: $publicKey}}) {
    id
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
  users {
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