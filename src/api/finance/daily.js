import request from '@/utils/request';
export const getList = (params) => {
  return request({
    url: 'collectionDaily/list',
    params
  });
};
