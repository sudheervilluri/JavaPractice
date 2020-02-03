import BulkTransactionLoadConstants from './bulk-transaction-load-constants';

const getHeaderType = headerType => {
  let header;
  if (headerType === BulkTransactionLoadConstants.HEADER_IS_EMBEDDED) {
    header = BulkTransactionLoadConstants.EMBEDDED;
  } else if (headerType === BulkTransactionLoadConstants.HEADER_IS_GENERATED) {
    header = BulkTransactionLoadConstants.GENERATED;
  } else {
    header = null;
  }
  return header;
};

const getFormatType = formatType => {
  let format;
  if (formatType === BulkTransactionLoadConstants.FORMAT_IS_DELIMITED) {
    format = BulkTransactionLoadConstants.DELIMITED;
  } else if (formatType === BulkTransactionLoadConstants.FORMAT_IS_FIXED) {
    format = BulkTransactionLoadConstants.FIXED;
  } else {
    format = null;
  }
  return format;
};

const getAction = actionCode => {
  let action;

  switch (actionCode) {
    case BulkTransactionLoadConstants.ACTION_CODE_FOR_DELETE:
      action = BulkTransactionLoadConstants.DELETE;
      break;
    case BulkTransactionLoadConstants.ACTION_CODE_FOR_ADD:
      action = BulkTransactionLoadConstants.ADD;
      break;
    case BulkTransactionLoadConstants.ACTION_CODE_FOR_ADD_UPDATE:
      action = BulkTransactionLoadConstants.ADD_UPDATE;
      break;
    case BulkTransactionLoadConstants.ACTION_CODE_FOR_UPDATE:
      action = BulkTransactionLoadConstants.UPDATE;
      break;
    case BulkTransactionLoadConstants.ACTION_CODE_FOR_UPDATE_ADD:
      action = BulkTransactionLoadConstants.UPDATE_ADD;
      break;
    default:
      action = null;
      break;
  }
  return action;
};

const getNullCharacterOrNotValued = () => {
  const nullCharOrNotValued = [];

  nullCharOrNotValued.push({ nullCharOrNotValued: '000  NUL (ascii) = NUL (ebcdic)' });
  nullCharOrNotValued.push({ nullCharOrNotValued: '001  SOH (ascii) = SOH (ebcdic)' });
  nullCharOrNotValued.push({ nullCharOrNotValued: '002  STX (ascii) = STX (ebcdic)' });
  nullCharOrNotValued.push({ nullCharOrNotValued: '003  ETX (ascii) = ETX (ebcdic)' });
  nullCharOrNotValued.push({ nullCharOrNotValued: '004  EOT (ascii) = SEL (ebcdic)' });
  nullCharOrNotValued.push({ nullCharOrNotValued: '005  ENQ (ascii) = HT  (ebcdic)' });
  nullCharOrNotValued.push({ nullCharOrNotValued: '006  ACK (ascii) = RNL (ebcdic)' });
  nullCharOrNotValued.push({ nullCharOrNotValued: '007  BEL (ascii) = DEL (ebcdic)' });
  nullCharOrNotValued.push({ nullCharOrNotValued: '008  BS  (ascii) = GE  (ebcdic)' });
  nullCharOrNotValued.push({ nullCharOrNotValued: '009  HT  (ascii) = SPS (ebcdic)' });
  nullCharOrNotValued.push({ nullCharOrNotValued: '010  LF  (ascii) = RPT (ebcdic)' });
  nullCharOrNotValued.push({ nullCharOrNotValued: '011  VI  (ascii) = VT  (ebcdic)' });
  nullCharOrNotValued.push({ nullCharOrNotValued: '012  FF  (ascii) = FF  (ebcdic)' });
  nullCharOrNotValued.push({ nullCharOrNotValued: '013  CR  (ascii) = CR  (ebcdic)' });
  nullCharOrNotValued.push({ nullCharOrNotValued: '014  SO  (ascii) = SO  (ebcdic)' });
  nullCharOrNotValued.push({ nullCharOrNotValued: '015  SI  (ascii) = SI  (ebcdic)' });
  nullCharOrNotValued.push({ nullCharOrNotValued: '016  DLE (ascii) = DLE (ebcdic)' });
  nullCharOrNotValued.push({ nullCharOrNotValued: '017  CS1 (ascii) = DC1 (ebcdic)' });
  nullCharOrNotValued.push({ nullCharOrNotValued: '018  DC2 (ascii) = DC2 (ebcdic)' });
  nullCharOrNotValued.push({ nullCharOrNotValued: '019  DC3 (ascii) = DC3 (ebcdic)' });
  nullCharOrNotValued.push({ nullCharOrNotValued: '020  DC4 (ascii) = RES/ENP (ebcdic)' });
  nullCharOrNotValued.push({ nullCharOrNotValued: '021  NAK (ascii) = NL  (ebcdic)' });
  nullCharOrNotValued.push({ nullCharOrNotValued: '022  SYN (ascii) = BS  (ebcdic)' });
  nullCharOrNotValued.push({ nullCharOrNotValued: '023  ETB (ascii) = POC (ebcdic)' });
  nullCharOrNotValued.push({ nullCharOrNotValued: '024  CAN (ascii) = CAN (ebcdic)' });
  nullCharOrNotValued.push({ nullCharOrNotValued: '025  EM  (ascii) = EM  (ebcdic)' });
  nullCharOrNotValued.push({ nullCharOrNotValued: '026  SUB (ascii) = UBS (ebcdic)' });
  nullCharOrNotValued.push({ nullCharOrNotValued: '027  ESC (ascii) = CU1 (ebcdic)' });
  nullCharOrNotValued.push({ nullCharOrNotValued: '028  FS  (ascii) = IFS (ebcdic)' });
  nullCharOrNotValued.push({ nullCharOrNotValued: '029  GS  (ascii) = IGS (ebcdic)' });
  nullCharOrNotValued.push({ nullCharOrNotValued: '030  RS  (ascii) = IRS (ebcdic)' });
  nullCharOrNotValued.push({ nullCharOrNotValued: '031  US  (ascii) = ITB/IUS (ebcdic)' });

  for (let i = 128; i <= 255; i += 1) {
    nullCharOrNotValued.push({ nullCharOrNotValued: `${i}` });
  }

  return nullCharOrNotValued;
};

const bulkTransactionLoadUtils = {
  getHeaderType,
  getFormatType,
  getAction,
  getNullCharacterOrNotValued
};

export default bulkTransactionLoadUtils;
