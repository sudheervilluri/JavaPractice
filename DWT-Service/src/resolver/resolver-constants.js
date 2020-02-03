class ResolverConstants {
  static get CLUSTER_JOB_TYPE_ID() {
    return '410';
  }

  static get OLAP_CUBE_JOB_TYPE_ID() {
    return '390';
  }

  static get CRYSTAL_REPORT_JOB_TYPE_ID() {
    return '400';
  }

  static get STORED_PROCEDURE_JOB_TYPE_ID() {
    return '200';
  }

  // prettier-ignore
  static get JOB_PARAM_QUERY() {
    return 'select parm_name, parm_seq, actl_val from smsdbr.sched_dbparm_occr where job_name =\'%jobName%\' order by parm_seq';
  }

  // prettier-ignore
  static get JOB_PARAM_QUERY_FOR_STORED_PROCEDURE_JOB_TYPE() {
    return 'select obj_id, parm_name, actl_val from smsdbr.sched_dbparm_occr where job_name =\'%jobName%\' order by parm_seq, actl_val';
  }

  // prettier-ignore
  static get JOB_DETAILS_QUERY_FOR_STORED_PROCEDURE_JOB_TYPE() {
    return 'select smsdbr.AccountNameToDisplayName_fn(a.userid) userid, a.obj_type, a.obj_id, b.obj_name, a.db_name, a.rmt_server, b.obj_share_ind, b.owner_userid from smsdbr.sched_db_job_def  a, smsdbr.sched_db_exec_def b where a.obj_id=b.obj_id and a.job_name = \'%jobName%\''
  }

  static get LIST_OF_OBJECTS_FROM_STORED_PROCEDURE() {
    return 'EXECUTE %databaseName%.smsdbr.sms_sp 0';
  }

  // prettier-ignore
  static get LIST_OF_OBJECTS_FROM_EXEC_DEF_TABLE() {
    return 'select owner_userid, obj_name, obj_id from smsdbr.sched_db_exec_def where obj_type = %jobTypeId% and db_name = \'%databaseName%\'';
  }

  // prettier-ignore
  static get COLUMNS_OF_OBJECTS() {
    return 'smsdbr.sms_columns \'%objectName%\''
  }

  static get PARAMETERS_OF_OBJECTS() {
    return 'select p.parm_name, g.prompt_text, p.prompt_text, g.def_val, p.dflt_val from smsdbr.sched_db_parm_def p left join smsdbr.sched_gbl_parm_def g on p.dflt_val = g.parm_name where p.obj_id = %objectId% order by p.prompt_text';
  }

  static get CLUSTER_QUERY() {
    return 'exec smsdbr.CGP_ClstrList_sp 0,0,0,0';
  }

  static get OLAP_CUBE_QUERY() {
    return 'select * from smsdbr.SchedCubeList';
  }

  static get CRYSTAL_REPORT_QUERY() {
    return 'exec smsdbr.WPBCRarticlelists 1,null,2,null';
  }

  // prettier-ignore
  static get EXECUTION_HISTORY_QUERY() {
    return 'select start_dtime, end_dtime, sts_cd, job_name, obj_type  from smsdbr.sched_exec_hist where job_name =\'%jobName%\' order by start_dtime desc';
  }

  // prettier-ignore
  static get TRANSACTION_TYPE_QUERY() {
    return 'select distinct a.caption, a.trans_id, b.sms_trans_act from smsdbr.smsv_trans_desc a, smsdbr.sms_trans_map b where a.trans_id = b.sms_trans_type and b.trans_fmt = %format% order by a.caption';
  }

  static get OLAP_CUBE_SERVER_NAME() {
    return 'OLAP Server Name';
  }

  static get MAX_STREAMNAME_LENGTH() {
    return 8;
  }

  static get MAX_QUEUENAME_LENGTH() {
    return 2;
  }

  static get MAX_JOBNAME_LENGTH() {
    return 8;
  }

  static get MAX_JOBTYPE_ID_LENGTH() {
    return 3;
  }

  static get FORMAT_IS_DELIMITED() {
    return 'Delimited';
  }

  static get FORMAT_IS_FIXED() {
    return 'Fixed';
  }

  static get CREATED_BY() {
    return 'Created By';
  }

  static get OBJECT_NAME() {
    return 'Object Name';
  }

  static get OBJECT_ID() {
    return 'Object ID';
  }
}
export default ResolverConstants;
