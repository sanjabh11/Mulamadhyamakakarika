/**
 * Interaction Buttons Component
 * 
 * Renders interaction buttons for verse animations
 * Design-compliant: 8px grid, 44px touch targets, single accent color
 */

import React from 'react';
import DESIGN_TOKENS from '../../lib/animations/design-tokens';

export default function InteractionButtons({ interactions, onInteraction, disabled = false }) {
  if (!interactions || interactions.length === 0) {
    return null;
  }

  const handleClick = (interaction) => {
    if (disabled) return;
    if (onInteraction) {
      onInteraction(interaction);
    }
  };

  return (
    <div className="interaction-buttons">
      {interactions.map((interaction) => (
        <button
          key={interaction.id}
          className={`interaction-btn ${interaction.is_solution ? 'solution' : ''}`}
          onClick={() => handleClick(interaction)}
          disabled={disabled}
          title={interaction.tooltip || interaction.message}
        >
          <span className="btn-label">{interaction.button_label}</span>
          {interaction.sanskrit && (
            <span className="btn-sanskrit">{interaction.sanskrit}</span>
          )}
        </button>
      ))}

      <style jsx>{`
        .interaction-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: ${DESIGN_TOKENS.spacing[2]};
          padding: ${DESIGN_TOKENS.spacing[3]};
          background: rgba(15, 23, 42, 0.8);
          border-radius: ${DESIGN_TOKENS.borderRadius.lg};
          backdrop-filter: blur(8px);
        }

        .interaction-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: ${DESIGN_TOKENS.spacing.half};
          padding: ${DESIGN_TOKENS.spacing['1.5']} ${DESIGN_TOKENS.spacing[3]};
          min-height: 48px; /* Touch target compliance */
          min-width: 120px;
          background: ${DESIGN_TOKENS.colors.dark.surface};
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: ${DESIGN_TOKENS.borderRadius.md};
          color: ${DESIGN_TOKENS.colors.dark.text};
          font-size: ${DESIGN_TOKENS.typography.fontSize.base}; /* Minimum 16px */
          font-weight: ${DESIGN_TOKENS.typography.fontWeight.medium};
          cursor: pointer;
          transition: all ${DESIGN_TOKENS.transitions.base};
          box-shadow: ${DESIGN_TOKENS.shadows['sm-dark']};
        }

        .interaction-btn:hover:not(:disabled) {
          background: rgba(139, 92, 246, 0.15);
          border-color: ${DESIGN_TOKENS.colors.accent};
          box-shadow: ${DESIGN_TOKENS.shadows['md-dark']};
          transform: translateY(-2px);
        }

        .interaction-btn:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: ${DESIGN_TOKENS.shadows['sm-dark']};
        }

        .interaction-btn:focus {
          outline: 2px solid ${DESIGN_TOKENS.colors.accent};
          outline-offset: 2px;
        }

        .interaction-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .interaction-btn.solution {
          background: ${DESIGN_TOKENS.colors.accent}; /* Solid accent - no gradient */
          border-color: ${DESIGN_TOKENS.colors.accent};
          color: #FFFFFF;
        }

        .interaction-btn.solution:hover:not(:disabled) {
          background: ${DESIGN_TOKENS.colors.accentHover}; /* 10% darker */
        }

        .btn-label {
          font-size: ${DESIGN_TOKENS.typography.fontSize.base};
          line-height: ${DESIGN_TOKENS.typography.lineHeight.normal};
        }

        .btn-sanskrit {
          font-size: ${DESIGN_TOKENS.typography.fontSize.xs}; /* 14px minimum */
          color: rgba(255, 255, 255, 0.7);
          font-style: italic;
        }

        @media (max-width: ${DESIGN_TOKENS.breakpoints.tablet}) {
          .interaction-buttons {
            gap: ${DESIGN_TOKENS.spacing[1]};
            padding: ${DESIGN_TOKENS.spacing[2]};
          }

          .interaction-btn {
            flex: 1 1 calc(50% - ${DESIGN_TOKENS.spacing[1]});
            min-width: unset;
          }
        }
      `}</style>
    </div>
  );
}
