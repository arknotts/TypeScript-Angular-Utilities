/// <reference path='../../../typings/chai/chai.d.ts' />
/// <reference path='../../../typings/sinon/sinon.d.ts' />
/// <reference path='../../../typings/mocha/mocha.d.ts' />
/// <reference path='../../../typings/angularMocks.d.ts' />
/// <reference path='../../../typings/chaiAssertions.d.ts' />

/// <reference path='validation.service.ts' />
/// <reference path='../test/angularFixture.ts' />

module rl.utilities.services.validation {
	'use strict';

	import __test = rl.utilities.services.test;

	interface IMockValidationHandler {
		validate: Sinon.SinonSpy;
		showErrors?: Sinon.SinonSpy;
		isActive?: Sinon.SinonSpy | boolean;
	}

	describe('validation', () => {
		var validation: IValidationService;

		beforeEach(() => {
			angular.mock.module(moduleName);

			var services: any = __test.angularFixture.inject(factoryName);
			var validationFactory: IValidationServiceFactory = services[factoryName];
			validation = validationFactory.getInstance();
		});

		describe('validate', (): void => {
			it('should register a validation handler and use it to validate', (): void => {
				var handler: IMockValidationHandler = {
					validate: sinon.spy((): boolean => { return true; }),
				};

				validation.registerValidationHandler(<any>handler);

				var isValid: boolean = validation.validate();

				sinon.assert.calledOnce(handler.validate);
				expect(isValid).to.be.true;
			});

			it('should tell the handler to show errors if validation fails', (): void => {
				var handler: IMockValidationHandler = {
					validate: sinon.spy((): boolean => { return false; }),
					showErrors: sinon.spy(),
				};

				validation.registerValidationHandler(<any>handler);

				var isValid: boolean = validation.validate();

				sinon.assert.calledOnce(handler.validate);
				expect(isValid).to.be.false;
				sinon.assert.calledOnce(handler.showErrors);
			});

			it('should handle multiple validators and call showErrors only on the first one to fail', (): void => {
				var firstValidHandler: IMockValidationHandler = {
					validate: sinon.spy((): boolean => { return true; }),
				};
				var secondValidHandler: IMockValidationHandler = {
					validate: sinon.spy((): boolean => { return true; }),
				};
				var firstFailingHandler: IMockValidationHandler = {
					validate: sinon.spy((): boolean => { return false; }),
					showErrors: sinon.spy(),
				};
				var thirdValidHandler: IMockValidationHandler = {
					validate: sinon.spy((): boolean => { return true; }),
				};
				var secondFailingHandler: IMockValidationHandler = {
					validate: sinon.spy((): boolean => { return false; }),
					showErrors: sinon.spy(),
				};

				validation.registerValidationHandler(<any>firstValidHandler);
				validation.registerValidationHandler(<any>secondValidHandler);
				validation.registerValidationHandler(<any>firstFailingHandler);
				validation.registerValidationHandler(<any>thirdValidHandler);
				validation.registerValidationHandler(<any>secondFailingHandler);

				var isValid: boolean = validation.validate();

				sinon.assert.calledOnce(firstFailingHandler.validate);
				sinon.assert.calledOnce(secondValidHandler.validate);
				sinon.assert.calledOnce(firstFailingHandler.validate);
				// halt execution after the first failed validation check
				sinon.assert.notCalled(thirdValidHandler.validate);
				sinon.assert.notCalled(secondFailingHandler.validate);
				expect(isValid).to.be.false;

				sinon.assert.calledOnce(firstFailingHandler.showErrors);
				sinon.assert.notCalled(secondFailingHandler.showErrors);
			});
		});

		describe('isActive', (): void => {
			it('should disable a validator if isActive is set to false', (): void => {
				var inactiveHandler: IMockValidationHandler = {
					validate: sinon.spy(),
					isActive: false,
				};

				validation.registerValidationHandler(<any>inactiveHandler);

				var isValid: boolean = validation.validate();

				sinon.assert.notCalled(inactiveHandler.validate);
				// defaults to true if no active validators
				expect(isValid).to.be.true;
			});

			it('should call isActive and disable the validator if the result is false', (): void => {
				var inactiveHandler: IMockValidationHandler = {
					validate: sinon.spy((): boolean => { return false; }),
					isActive: sinon.spy((): boolean => { return false; }),
				};
				var activeHandler: IMockValidationHandler = {
					validate: sinon.spy((): boolean => { return true; }),
					isActive: sinon.spy((): boolean => { return true; }),
				};

				validation.registerValidationHandler(<any>inactiveHandler);
				validation.registerValidationHandler(<any>activeHandler);

				var isValid: boolean = validation.validate();

				sinon.assert.calledOnce(<Sinon.SinonSpy>inactiveHandler.isActive);
				sinon.assert.notCalled(inactiveHandler.validate);
				sinon.assert.calledOnce(<Sinon.SinonSpy>activeHandler.isActive);
				sinon.assert.calledOnce(activeHandler.validate);
				expect(isValid).to.be.true;
			});
		});

		describe('unregister', (): void => {
			it('should return a function to unregister the validation handler', (): void => {
				var handlerToUnregister: IMockValidationHandler = {
					validate: sinon.spy((): boolean => { return false; }),
					showErrors: sinon.spy(),
				};
				var activeHandler: IMockValidationHandler = {
					validate: sinon.spy((): boolean => { return true; }),
				};

				var unregister: IUnregisterFunction = validation.registerValidationHandler(<any>handlerToUnregister);
				validation.registerValidationHandler(<any>activeHandler);

				var isValid: boolean = validation.validate();

				expect(isValid).to.be.false;
				sinon.assert.calledOnce(handlerToUnregister.validate);
				sinon.assert.notCalled(activeHandler.validate);

				handlerToUnregister.validate.reset();
				activeHandler.validate.reset();

				unregister();

				isValid = validation.validate();

				expect(isValid).to.be.true;
				sinon.assert.notCalled(handlerToUnregister.validate);
				sinon.assert.calledOnce(activeHandler.validate);
			});
		});
	});
}
