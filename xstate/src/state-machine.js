import { Machine } from "xstate";

const lit = {
  on: {
    BREAK: "broken",
    TOGGLE: "unlit",
  },
};
const unlit = {
  on: {
    BREAK: "broken",
    TOGGLE: "lit",
  },
};
const broken = {
  type: "final",
};

const states = { lit, unlit, broken };

const initial = "unlit";

const config = {
  id: "(machine)",
  states: {
    lit: {
      on: {
        BREAK: {
          target: "broken",
        },
        TOGGLE: {
          target: "unlit",
        },
      },
    },
    unlit: {
      on: {
        BREAK: {
          target: "broken",
        },
        TOGGLE: {
          target: "lit",
        },
      },
    },
    broken: {
      type: "final",
    },
  },
  initial: "unlit",
};


const LightBulbMachine = 
/** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgBtcAXAYgCEAlAUQEEBpAbQAYBdRUABwD2sKrkH4+IAB6IAzAHYAbCQBMsgCwKArABoQAT0QrO6kuoCcl8wEZZKgByL1JgL4u9aLHkKkKNACoA8gDiwQAyjFy8SCBCIpRiEjEyCNZa6nqGqVr2JLL5duqKitbm8gqybh4YOATEJACu+H50TGxRknGi4pIpaRkGiPYqJFaWtg5Oru4gnrU+jc1U1EGhER0xXQk9yYj9mUbWnHkFKkUlZRVuM-iCEHCSc971fp3C3UmgKSry5qoa2gOCGMpjGNjsjmc6iqsxqz1ITVem3e20+0kQ6hUQNKfxy+TOxVK5XKMKedVIACMAE6CADWYDRW0SvQx9nkJC0ihUukGqXMynsp3ORKuMzJPje8WZuwQAFpFED5dcXEA */
Machine(config);

console.log(LightBulbMachine.transition)


/** @xstate-layout N4IgpgJg5mDOIC5QEMCuAXAFmAduglgMbLoD2ATgHT4QA2YAxBKTmNTgG6kDWbaWuAsTJUa9BPk6lh+FgG0ADAF1FSxKAAOpWPgIt1IAB6IATAE4TlAMwBGEwBYLAVgAcCqyYUuANCACeiFZWTk72AOxmTpQKNi5hsfYAbAC+yb782HhEJBTUdIxg5OS5GrQkAGYUALaUGYLZInniklwy8sqqBlo6ejgGxgjmlrYOzm4eXr4BCEEh4Vb2lGGJLiv2Nmap6RiZQjlUsGDoqBqUAO7IugDCLOX4UAwAkgByjwAqnUgg3bqyfV8DExuRKUCyxFzBEI2Jw2KaBSHhFxmSgmFaJMwKBSbNIgOpZYS5Q7HU7IDSlPw3HB3B7MVjsLi8Wo7eoEg5HE61Mm0Cm3e4SKRtHCqT6abS-fQAwKeRaJLFWMIuJxecyKuEzBHjaKxNYQra45n4-aUIkcqCkN6kR44X7IWgAZXQJEYIu+Yt6-UQiTCatmoUSNhBqNWZliNj1eL2jRNpzNFqtNvtjvQzpsai+P3dkpmXqsKPcNiCHkSCycauDoLMlYDCj9Zji4YNkcJ7Jj5st1oItodToYchMadFPT+HuzYVznlshdRJZ9CMryOWqwhrgbAkNUfuOCtxo0yDOOAAgoQRL3lF03cOs+sTFEbHKXCYwiYgkjZyFQhCUR4kaswk5V7sDSEpuVoMHajwAOLPAA+gAqgACi6GaXqAAxem+76JFEQaJPYCj2ABLJGjoUBbjgDAAEoAKJ2lRbzQfBB52naADqADyFEACJIReEqoYgSTuJQcRKgoY5uOYiQYaECzWB4IaOGGOIRkBBwgeRtJsC0PBsCRZFHiIPFDnxRiIE43r+IgYTWZQjhVgqSROMWViEeuwGkaBmn0jpxrqQZFByKm57Gf8-EIIJuYiZi4kKJJ0n2KsclAmC2LbGuTZqR5GksFpUiMnpVr+eQfYDq6IUjtOCiUDY8QuIqJg2HhAbSTVLgomi9hWGYf6uRlvmkbBpywLu+5FaepXISZgLrLZLidcs1l3s1lnqu+Gw2MJMJmOE7i9ap-U4INTJkHa6lMDl3mMiprIHUd-CkKdWX8q0JB-MKZ7prxoWmQgY6BqJjVWCsFhhPYGGOPYUQwkuuEEcpjb7Xpd0YA9Z2FMUVClBU1THYBN1IySKOPWRz3SK97QqB9g7it9AxPv9mKA8Dj5gytvpOMEG04RzIR7fjm6DWBkEwS8Rk0yO9MogDnXM6D4NIrm0NhFiNV88RAsaOddLaflGtFWLmZhZLN6MzLSIs-FQk4VYyr-vD6X7eQcBHPByCwLAZwUBAO57oex4UONwXi1mML4aCKzLGJ-pPtJSoba45gbMWauNE7RKu+7nvkBAQtQdBotU2VwdhRFwl-tFVgSWYUls5CIQKsJ34YnDaV40aacu27Hte1ruUMmwHfoBn3fZ-rheTbTAmypF5diZXsXV2qdZtXZGJzZ1Zg2yk9ttxupFsRgPujf75CB595VZhsNkuHYMLhAl6IKuDkSLNDEedSn7k4Af6C95dumbh-mPCaX0KpJHHNLDY8pEg12mOzTEVVFxegiJ-TK38MB-x1gA-eGB9ZBXPsXH6DhixS1NlA5YsD4RzBfksNEm8CyoNxkRZM3sxCMDeGxAA0lRGC1EABi1E7QAAkDYoR+jYO8wwnCb03nECEcta7vnwmELUqwsJuDtq3ZhuRrpOm9k7coadMCwUOKfLyWCmFuSoLolhlADFGJMYUUmgp3ogIvmFCRsVrDSK6pXBU8pWZwLnAlSgb9y6pX1A7G6NjIB2LAIYuAxjTEMHRiUMo6BKjkBqDYnRCNhCxPsYkxx5BnHkyFB0ceoDL6uBBAqOwMCIgSNRM-aEoJggLEiC4RhMSc7gTzmxWCHxKnuPETUpYN9URehDPU5+dZKCyk8I1OsqCGBXCEQeZ4EEqKiKmqYZYlgvDSM6hOYhlCEALIrJWew9hzCxUamEFZAAhAAMrBCiOzJ6DH2dERU20JgeCSGcpUixV48z-K1CJOTT52lgo8gAsu8D5FVvmHL+ScwFao8JRHnNXIEspAZKS0VYhgfCqKcSohRA8bwyXQT6SLZ4SKswsxBDEJyQQ17mVhGzMStl5xPkaqHMcLdIm7wDoInh3FhmEMBCi35xz3CnLVJ4NqOKb6dWitCbeRKMq53pYysKj5EgHLlf8xVK1PG8vnGJaE7hzJdJ3to6FnDHiISlYbIhsqjmmoxeakwqQcQ4FIBAOABgoVNDAEHd1aELJBLmAqKqkjlHWUYdGc4lx0CUmpJGsRgIvS3lqvVRqMQzm+gSqiWhwZoSaJFY640LZOTkkzfcbNuzBjVxUdXESHM6pBDHPLLxSDgShBTfW2M7YEzdmTC2z5CwZpYSNaEGqfizDP0VO1JcAZq1hujNOiqRqVE1XBE4BqTUS0ImVlVIMysnxJBTepI+fsRC7qzF1NdC7MTSOPfKR8scFAgjrLcjmkK8nqyynY1Aj6KDPpLhMeZTkbzPnMJEFdii5jolmni2KPUHVWIOlaaDP1fEqPfTWSIz4nwxqoSEeeGG4igxcjhvqBMH1FQIwMSR0kGpRHxSGIEDzGOIw1uByD5A2MCU6tEEYPjYjSIkS1BuS017JwE-zAahMTrqTE+FLCbS-wNQVKsP9IRpKTmqjEbq-phXbo1lp0I0kvDIkUzeFBKn27OyHl3LO3thq+1YwQqNAlq5RASp1CElYxK2tjjeJKdVQig0YYPYeXnhN+epgFhAPMQQLGgR4daz5SyoY-CoiEklzDYe1Y7dzSWvZacUiokLlcuoYmVsEEzcySt1hiAxirqn0HoBYyfLTsRK7WCBAWCI1kVixGfg3K9wQYhWZA3vPrKXBv+ZzaYGTknb4KWy8-R8670RYS3Utr+P8hsRCqt+cb3VFzTdQwlEbV7xs1m6Ut2JbChsIO8TInaBZXAFdjaEbqbVE2Vy1TW3DPS4kJNgEkwoQ2iy2QjqDBqXgaxWGfrheZsVMR4Wrm9qJeitNkZ+11P7wRVQPd+aE7UFgbyoK02clYK95zzZrDAhh-qgA */
createMachine<AuthContext, AuthEvent>(
  {
  context: {
    user: undefined,
    config: {},
    services: defaultServices,
    actorRef: undefined,
    hasSetup: false,
  },
  predictableActionArguments: true,
  id: "authenticator",
  initial: "idle",
  states: {
    idle: {
      invoke: {
        src: "getCurrentUser",
        onDone: [
          {
            target: "authenticated",
            actions: "setUser",
          },
        ],
        onError: [
          {
            target: "setup",
          },
        ],
      },
    },
    setup: {
      initial: "waitConfig",
      states: {
        waitConfig: {
          on: {
            INIT: {
              target: "applyConfig",
              actions: ["configure", "setHasSetup"],
            },
          },
        },
        applyConfig: {
          invoke: {
            src: "getAmplifyConfig",
            onDone: [
              {
                target: "goToInitialState",
                actions: "applyAmplifyConfig",
              },
            ],
          },
        },
        goToInitialState: {
          always: [
            {
              target: "#authenticator.signUp",
              cond: "isInitialStateSignUp",
            },
            {
              target: "#authenticator.resetPassword",
              cond: "isInitialStateResetPassword",
            },
            {
              target: "#authenticator.signIn",
            },
          ],
        },
      },
    },
    signIn: {
      initial: "spawnActor",
      states: {
        spawnActor: {
          always: {
            target: "runActor",
            actions: "spawnSignInActor",
          },
        },
        runActor: {
          entry: "clearActorDoneData",
          exit: "stopSignInActor",
        },
      },
      on: {
        SIGN_UP: {
          target: "signUp",
        },
        RESET_PASSWORD: {
          target: "resetPassword",
        },
      },
    },
    signUp: {
      initial: "spawnActor",
      states: {
        spawnActor: {
          always: {
            target: "runActor",
            actions: "spawnSignUpActor",
          },
        },
        runActor: {
          entry: "clearActorDoneData",
          exit: "stopSignUpActor",
        },
        autoSignIn: {
          invoke: {
            src: "getCurrentUser",
            onDone: [
              {
                target: "#authenticator.authenticated",
              },
            ],
            onError: [
              {
                target: "#authenticator.setup.goToInitialState",
              },
            ],
          },
        },
      },
      on: {
        SIGN_IN: {
          target: "signIn",
        },
      },
    },
    resetPassword: {
      initial: "spawnActor",
      states: {
        spawnActor: {
          always: {
            target: "runActor",
            actions: "spawnResetPasswordActor",
          },
        },
        runActor: {
          entry: "clearActorDoneData",
          exit: "stopResetPasswordActor",
        },
      },
      on: {
        SIGN_IN: {
          target: "signIn",
        },
      },
    },
    signOut: {
      initial: "spawnActor",
      states: {
        spawnActor: {
          always: {
            target: "runActor",
            actions: "spawnSignOutActor",
          },
        },
        runActor: {
          entry: "clearActorDoneData",
          exit: ["stopSignOutActor", "clearUser"],
        },
      },
    },
    authenticated: {
      initial: "idle",
      states: {
        idle: {
          on: {
            TOKEN_REFRESH: {
              target: "refreshUser",
            },
          },
        },
        refreshUser: {
          invoke: {
            src: "getCurrentUser",
            onDone: [
              {
                target: "idle",
                actions: "setUser",
              },
            ],
            onError: [
              {
                target: "#authenticator.signOut",
              },
            ],
          },
        },
      },
      on: {
        SIGN_OUT: {
          target: "signOut",
        },
      },
    },
  },
  on: {
    CHANGE: {
      actions: "forwardToActor",
    },
    BLUR: {
      actions: "forwardToActor",
    },
    SUBMIT: {
      actions: "forwardToActor",
    },
    FEDERATED_SIGN_IN: {
      actions: "forwardToActor",
    },
    RESEND: {
      actions: "forwardToActor",
    },
    SIGN_IN: {
      actions: "forwardToActor",
    },
    SKIP: {
      actions: "forwardToActor",
    },
  },
},
  {
    actions: {
      forwardToActor: choose([
        {
          cond: 'hasActor',
          actions: forwardTo((context) => context.actorRef),
        },
      ]),
      setUser: assign({
        // user: (_, event) => event.data as AmplifyUser,
      }),
      setActorDoneData: assign({
        actorDoneData: (_, event) => ({
          authAttributes: { ...event.data?.authAttributes },
          intent: event.data?.intent,
        }),
        user: (_, event) => event.data?.user,
      }),
      clearUser: assign({ user: undefined }),
      clearActorDoneData: assign({ actorDoneData: undefined }),
      applyAmplifyConfig: assign({
        config(context, event) {
          // The CLI uses uppercased constants in `aws-exports.js`, while `parameters.json` are lowercase.
          // We use lowercase to be consistent with previous versions' values.

          const cliLoginMechanisms =
            event.data.aws_cognito_username_attributes?.map((s) =>
              s.toLowerCase()
            ) ?? [];

          const cliVerificationMechanisms =
            event.data.aws_cognito_verification_mechanisms?.map((s) =>
              s.toLowerCase()
            ) ?? [];

          const cliSignUpAttributes =
            event.data.aws_cognito_signup_attributes?.map((s) =>
              s.toLowerCase()
            ) ?? [];

          const cliSocialProviders =
            event.data.aws_cognito_social_providers?.map((s) =>
              s.toLowerCase()
            ) ?? [];

          const cliPasswordSettings =
            event.data.aws_cognito_password_protection_settings || {};

          // By default, Cognito assumes `username`, so there isn't a different username attribute like `email`.
          // We explicitly add it as a login mechanism to be consistent with Admin UI's language.
          if (cliLoginMechanisms.length === 0) {
            cliLoginMechanisms.push('username');
          }

          // Prefer explicitly configured settings over default CLI values\
          const {
            loginMechanisms,
            signUpAttributes,
            socialProviders,
            initialState,
            formFields,
          } = context.config;
          return {
            loginMechanisms: loginMechanisms ?? cliLoginMechanisms,
            formFields: convertFormFields(formFields) ?? {},
            passwordSettings: cliPasswordSettings,
            signUpAttributes:
              signUpAttributes ??
              Array.from(
                new Set([
                  ...cliVerificationMechanisms,
                  ...cliSignUpAttributes,
                ])
              ),
            socialProviders: socialProviders ?? cliSocialProviders.sort(),
            initialState,
          };
        },
      }),
      spawnSignInActor: assign({
        actorRef: (context, _) => {
          const { services } = context;
          const actor = signInActor({ services }).withContext({
            authAttributes: context.actorDoneData?.authAttributes ?? {},
            user: context.user,
            intent: context.actorDoneData?.intent,
            country_code: DEFAULT_COUNTRY_CODE,
            formValues: {},
            touched: {},
            validationError: {},
            loginMechanisms: context.config?.loginMechanisms,
            socialProviders: context.config?.socialProviders,
            formFields: context.config?.formFields,
          });
          return spawn(actor, { name: 'signInActor' });
        },
      }),
      spawnSignUpActor: assign({
        actorRef: (context, _) => {
          const { services } = context;
          const actor = createSignUpMachine({ services }).withContext({
            authAttributes: context.actorDoneData?.authAttributes ?? {},
            country_code: DEFAULT_COUNTRY_CODE,
            intent: context.actorDoneData?.intent,
            formValues: {},
            touched: {},
            validationError: {},
            loginMechanisms: context.config?.loginMechanisms,
            socialProviders: context.config?.socialProviders,
            formFields: context.config?.formFields,
            passwordSettings: context.config?.passwordSettings,
          });
          return spawn(actor, { name: 'signUpActor' });
        },
      }),
      spawnResetPasswordActor: assign({
        actorRef: (context, _) => {
          const { services } = context;
          const actor = resetPasswordActor({ services }).withContext({
            formValues: {},
            touched: {},
            intent: context.actorDoneData?.intent,
            username: context.actorDoneData?.authAttributes?.username,
            formFields: context.config?.formFields,
            validationError: {},
          });
          return spawn(actor, { name: 'resetPasswordActor' });
        },
      }),
      spawnSignOutActor: assign({
        actorRef: (context) => {
          const actor = signOutActor.withContext({
            user: context.user,
          });
          return spawn(actor, { name: 'signOutActor' });
        },
      }),
      stopSignInActor: stopActor('signInActor'),
      stopSignUpActor: stopActor('signUpActor'),
      stopResetPasswordActor: stopActor('resetPasswordActor'),
      stopSignOutActor: stopActor('signOutActor'),
      configure: assign((_, event) => {
        const { services: customServices, ...config } = event.data;
        return {
          services: { ...defaultServices, ...customServices },
          config,
        };
      }),
      setHasSetup: assign({
        hasSetup: true,
      }),
    },
    guards: {
      // guards for initial states
      isInitialStateSignUp: (context) =>
        context.config.initialState === 'signUp',
      isInitialStateResetPassword: (context) =>
        context.config.initialState === 'resetPassword',
      // guards for redirections
      shouldRedirectToSignUp: (_, event) =>
        event.data?.intent === 'confirmSignUp',
      shouldRedirectToResetPassword: (_, event) =>
        event.data?.intent === 'confirmPasswordReset',
      shouldAutoSignIn: (_, event) => event.data?.intent === 'autoSignIn',
      shouldSetup: (context) => context.hasSetup === false,
      // other context guards
      hasActor: (context) => !!context.actorRef,
    },
    services: {
      getCurrentUser: (context, _) => context.services.getCurrentUser(),
      getAmplifyConfig: (context, _) => context.services.getAmplifyConfig(),
    },
  }
);