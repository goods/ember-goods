import ApplicationInstance from '@ember/application/instance';
//@ts-ignore
import config from 'ember-get-config';
import { isPresent } from '@ember/utils';

export function initialize(appInstance: ApplicationInstance): void {
  const applicationRoute: any = appInstance.lookup('route:application');
  const session: any = appInstance.lookup('service:session');

  let authenticatedRoute = config.APP.goods.signedInRoute;
  let invalidatedRoute = config.APP.goods.signedOutRoute;

  if (isPresent(authenticatedRoute)) {
    session.on('authenticationSucceeded', function () {
      applicationRoute.transitionTo(authenticatedRoute);
    });
  }

  if (isPresent(invalidatedRoute)) {
    session.on('invalidationSucceeded', function () {
      applicationRoute.transitionTo(invalidatedRoute);
    });
  }
}

export default {
  initialize,
  name: 'session-events',
  after: 'ember-simple-auth',
};
