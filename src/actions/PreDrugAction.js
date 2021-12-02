export const AddPreDrugInfo = preDrugInfo => {
  return {
    type: 'ADD_PREDRUGINFO',
    preDrugInfo: {
      id: preDrugInfo.id,
      name: preDrugInfo.name,
      howToStore: preDrugInfo.howToStore,
      howMuch: preDrugInfo.howMuch,
      effect: preDrugInfo.effect,
      mainINGR: preDrugInfo.mainINGR,
      time: preDrugInfo.time,
      barcode: preDrugInfo.barcode,
      seqcode: preDrugInfo.seqcode,
      StdCode: preDrugInfo.StdCode,
      ATCcode: preDrugInfo.ATCcode,
      caution: preDrugInfo.caution,
      brandName: preDrugInfo.brandName,
      updateInfo: preDrugInfo.updateInfo,
      PregnantGrade: preDrugInfo.PregnantGrade,
      PregnantNote: preDrugInfo.PregnantNote,
      ElderNote: preDrugInfo.ElderNote,
      ChildAge: preDrugInfo.ChildAge,
      ChildRange: preDrugInfo.ChildRange,
      ChildNote: preDrugInfo.ChildNote,
      MaxInjectDay: preDrugInfo.MaxInjectDay,
      MaxDayCapacity: preDrugInfo.MaxDayCapacity,
      CombTarget: preDrugInfo.CombTarget,
      CombNote: preDrugInfo.CombNote,
      CombCount: preDrugInfo.CombCount,
      EffectGroup: preDrugInfo.EffectGroup,
      EffectTarget: preDrugInfo.EffectTarget,
      DuplicationCount: preDrugInfo.DuplicationCount,
      INGRCode: preDrugInfo.INGRCode,
      PreDrugDays: preDrugInfo.PreDrugDays,
      MorningTime: preDrugInfo.MorningTime,
      LunchTime: preDrugInfo.LunchTime,
      DinnerTime: preDrugInfo.DinnerTime,
      NightTime: preDrugInfo.NightTime,
      MorningAlarm: preDrugInfo.MorningAlarm,
      LunchAlarm: preDrugInfo.LunchAlarm,
      DinnerAlarm: preDrugInfo.DinnerAlarm,
      NightAlarm: preDrugInfo.NightAlarm,
    },
  };
};

export const RemovePreDrugInfo = id => {
  return {
    type: 'REMOVE_PREDRUGINFO',
    id,
  };
};
