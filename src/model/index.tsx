import transferModel, { TransferModel } from './transferModel';
import hubModel, { HubModel } from './hubModel';
import analyticsModel, { AnalyticsModel } from './analyticsModel';
import detailsModel, { DetailsModel } from './detailsModel';
import nocustModel, { NocustModel } from './nocustModel';

export interface StoreModel {
  transferModel: TransferModel;
  hubModel: HubModel;
  analyticsModel: AnalyticsModel;
  detailsModel: DetailsModel;

  nocustModel: NocustModel;
}

const model: StoreModel = {
  transferModel,
  hubModel,
  analyticsModel,
  detailsModel,
  nocustModel,
};

export default model;
