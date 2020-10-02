import { useUserShippingFactory, UseUserShippingFactoryParams } from '@vue-storefront/core';

const addresses: any[] = [
  {
    id: 1,
    firstName: 'Sviatlana',
    lastName: 'Havaka',
    streetName: 'Zielinskiego',
    apartment: '24/193A',
    city: 'Phoenix',
    state: null,
    zipCode: '26-600',
    country: 'US',
    phoneNumber: '560123456',
    isDefault: true
  },
  {
    id: 2,
    firstName: 'Sviatlana',
    lastName: 'Havaka',
    streetName: 'Zielinskiego',
    apartment: '20/193A',
    city: 'Atlanta',
    state: null,
    zipCode: '53-603',
    country: 'US',
    phoneNumber: '560123456',
    isDefault: false
  }
];

const findBiggestId = () => addresses.reduce((biggest, curr) => {
  if (curr.id > biggest) {
    return curr.id;
  }
  return biggest;
}, 0);

const disableOldDefault = () => {
  const oldDefault = addresses.find(address => address.isDefault);
  if (oldDefault) {
    oldDefault.isDefault = false;
  }
};

const sortDefaultAtTop = (a, b) => {
  if (a.isDefault) {
    return -1;
  } else if (b.isDefault) {
    return 1;
  }
  return 0;
};

const params: UseUserShippingFactoryParams<any> = {
  addAddress: async (params?) => {
    console.log('Mocked: addAddress', params.address);

    const newAddress = {
      ...params.address,
      id: findBiggestId() + 1
    };

    if (params.address.isDefault) {
      disableOldDefault();
      addresses.unshift(newAddress);
    } else {
      addresses.push(newAddress);
    }

    return Promise.resolve(addresses);
  },

  deleteAddress: async (params?) => {
    console.log('Mocked: deleteAddress', params);

    const indexToRemove = addresses.findIndex(address => address.id === params.address.id);
    if (indexToRemove < 0) {
      return Promise.reject('This address does not exist');
    }

    addresses.splice(indexToRemove, 1);
    return Promise.resolve(addresses);
  },

  updateAddress: async (params?) => {
    console.log('Mocked: updateAddress', params);

    const indexToUpdate = addresses.findIndex(address => address.id === params.address.id);
    if (indexToUpdate < 0) {
      return Promise.reject('This address does not exist');
    }

    const isNewDefault = params.address.isDefault && addresses[0].id !== params.address.id;

    if (isNewDefault) {
      disableOldDefault();
    }

    addresses[indexToUpdate] = params.address;

    if (isNewDefault) {
      addresses.sort(sortDefaultAtTop);
    }
    return Promise.resolve(addresses);
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  load: async (params?) => {
    console.log('Mocked: load');
    return Promise.resolve(addresses);
  },

  setDefault: async (params?) => {
    console.log('Mocked: setDefault');
    const isDefault = id => addresses[0].id !== id;

    if (!isDefault(params.address.id)) {
      disableOldDefault();
      const indexToUpdate = addresses.findIndex(address => address.id === params.address.id);
      if (indexToUpdate < 0) {
        return Promise.reject('This address does not exist');
      }
      addresses[indexToUpdate].isDefault = true;
      addresses.sort(sortDefaultAtTop);
    }

    return Promise.resolve({});
  }
};

const { useUserShipping } = useUserShippingFactory<any>(params);

export default useUserShipping;
